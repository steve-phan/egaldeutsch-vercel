import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider, Language } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700", "800", "900"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.egaldeutsch.com"),
  title: {
    default: "EgalDeutsch — German Grammar Learning Platform",
    template: "%s | EgalDeutsch"
  },
  description: "EgalDeutsch is the ultimate interactive platform for mastering German grammar from A1 to B2. Prepare for TELC, Goethe exams, and B2 Beruf with our structured modules and quizzes.",
  keywords: ["German Grammar", "German Quiz", "TELC B2", "B2 Beruf Deutsch", "Goethe Exam Prep", "Learn German", "A1-B2 German"],
  authors: [{ name: "EgalDeutsch Team" }],
  creator: "EgalDeutsch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.egaldeutsch.com",
    siteName: "EgalDeutsch",
    title: "EgalDeutsch — German Grammar Mastery",
    description: "EgalDeutsch is the ultimate interactive platform for German grammar mastery and exam success.",
    images: [
      {
        url: "/ed_logo.svg", // Recommended size 1200x630
        width: 1200,
        height: 630,
        alt: "EgalDeutsch Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EgalDeutsch — Master German Grammar",
    description: "Interactive German grammar quizzes and exam prep for TELC, Goethe, and B2 Beruf.",
    images: ["/ed_logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/ed_favicon.svg?v=1",
    shortcut: "/ed_favicon.svg",
    apple: "/ed_favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("language")?.value as Language;

  // Priority: Session > Cookie > Default
  const initialLanguage = (session?.user as any)?.language || cookieLang || "en";

  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <body className={`${montserrat.variable} ${openSans.variable} font-sans antialiased text-slate-800 bg-background`} suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider initialLanguage={initialLanguage} initialIsLoaded={true}>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
