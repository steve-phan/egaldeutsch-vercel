import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // We'll proxy this to our Go backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/account/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (res.ok && data?.user) {
          return {
            ...data.user,
            id: data.user.id || data.user._id,
            accessToken: data.token,
            role: data.user.role || "student",
            language: data.user.language || "en"
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id || (user as any)._id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role || "student";
        token.accessToken = (user as any).accessToken;
        token.language = (user as any).language || "en";
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        if (session.role) token.role = session.role;
        if (session.language) token.language = session.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).language = token.language;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Sync Google user with our Go backend
          const syncRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/account/google-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          });
          
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.token) {
              (user as any).accessToken = syncData.token;
              (user as any).id = syncData.user?.id || syncData.user?._id;
              (user as any).language = syncData.user?.language || "en";
            }
          }
        } catch (error) {
          console.error("Failed to sync Google user with backend:", error);
        }
      }
      return true; // Allow sign in to proceed regardless of sync success
    },
  },
  session: {
    strategy: "jwt",
  },
};
