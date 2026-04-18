import { Metadata } from "next";
import { HomeClientView } from "@/components/home/home-client-view";

export const metadata: Metadata = {
  title: "EgalDeutsch — German Grammar Mastery",
  description: "Join the ultimate community for German grammar mastery. From A1 basics to B2 Beruf and TELC exam preparation. Start your journey for free today.",
  openGraph: {
    title: "EgalDeutsch — Professional German Learning Platform",
    description: "Master grammar, ace your TELC exams, and prepare for German business communication.",
  }
};

export default function Home() {
  return <HomeClientView />;
}
