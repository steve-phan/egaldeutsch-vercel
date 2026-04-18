import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["700", "800", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.egaldeutsch.com"),
  title: {
    default: "EgalDeutsch — Master German Grammar",
    template: "%s | EgalDeutsch"
  },
  description: "Master German grammar from A1 to B2 with interactive quizzes, TELC & Goethe exam preparation, and professional B2 Beruf training.",
  keywords: ["German Grammar", "German Quiz", "TELC B2", "B2 Beruf Deutsch", "Goethe Exam Prep", "Learn German", "A1-B2 German"],
  authors: [{ name: "EgalDeutsch Team" }],
  creator: "EgalDeutsch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.egaldeutsch.com",
    siteName: "EgalDeutsch",
    title: "EgalDeutsch — Master German Grammar",
    description: "The ultimate interactive platform for German grammar mastery and exam success.",
    images: [
      {
        url: "/og-image.png", // Recommended size 1200x630
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
    images: ["/og-image.png"],
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
    icon: "/favicon.ico?v=1",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${openSans.variable} font-sans antialiased text-slate-800 bg-background`} suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
