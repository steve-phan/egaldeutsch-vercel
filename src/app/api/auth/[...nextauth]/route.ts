import NextAuth, { NextAuthOptions } from "next-auth";
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
          // Return the actual user object, and maybe attach the token for later use
          return {
            ...data.user,
            id: data.user.id || data.user._id, // Handle both id formats
            accessToken: data.token,
            role: data.user.role || "student" // Default fallback
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
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        if (session.role) token.role = session.role;
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
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Sync Google user with our Go backend
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/account/google-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          });
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
