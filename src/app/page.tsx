import { Metadata } from "next";
import { HomeClientView } from "@/components/home/home-client-view";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { API_ROUTES, BACKEND_URL } from "@/lib/constants";
import { CategoryMeta } from "@/types/quiz";
import { Idiom } from "@/types/idiom";

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

async function getInitialData() {
  const [catRes, idiomRes] = await Promise.all([
    fetch(`${BACKEND_URL}${API_ROUTES.QUIZ_CATEGORIES}`, { next: { revalidate: 3600 } }),
    fetch(`${BACKEND_URL}${API_ROUTES.IDIOM_RANDOM}`, { next: { revalidate: 3600 } })
  ]);

  const categories = catRes.ok ? await catRes.json() : [];
  const randomIdiom = idiomRes.ok ? await idiomRes.json() : null;

  return { categories, randomIdiom };
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const { categories, randomIdiom } = await getInitialData();
  
  return (
    <HomeClientView 
      initialSession={session} 
      initialCategories={categories}
      initialIdiom={randomIdiom}
    />
  );
}
