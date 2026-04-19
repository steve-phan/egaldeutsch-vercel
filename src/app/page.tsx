import { Metadata } from "next";
import { HomeClientView } from "@/components/home/home-client-view";

export const metadata: Metadata = {
  title: "EgalDeutsch — Professional German Learning Platform",
  description: "EgalDeutsch is the ultimate interactive community for German grammar mastery. From A1 basics to B2 Beruf and TELC exam preparation. Start your journey for free today.",
  openGraph: {
    title: "EgalDeutsch — German Grammar Mastery",
    description: "Master German grammar, ace your TELC exams, and prepare for German business communication with EgalDeutsch.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EgalDeutsch — Professional German Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EgalDeutsch — German Grammar Mastery",
    description: "Interactive German grammar quizzes and exam prep for TELC, Goethe, and B2 Beruf.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return <HomeClientView />;
}
