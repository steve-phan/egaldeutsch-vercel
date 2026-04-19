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
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Suspense } from "react";
import { ServerCategorySection } from "@/components/home/server-category-section";
import { ServerIdiomSection } from "@/components/home/server-idiom-section";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton for the grammar modules
function CategorySkeleton() {
  return (
    <Section spacing="md">
      <Card className="space-y-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48 mb-3" />
          <div className="h-0.5 flex-1 bg-slate-100/50 rounded-full" />
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="min-w-[280px] h-[190px] rounded-2xl" />
          ))}
        </div>
      </Card>
    </Section>
  );
}

// Loading skeleton for the featured idiom
function IdiomSkeleton() {
  return (
    <Section spacing="md">
      <Skeleton className="w-full h-[320px] rounded-[2rem]" />
    </Section>
  );
}

export default async function Home() {
  // Session check is fast (JWT/Cookie), so we keep it here to avoid Hero flicker.
  // The slow category/idiom calls are moved into streamed components.
  const session = await getServerSession(authOptions);
  
  return (
    <HomeClientView initialSession={session}>
      <Suspense fallback={<IdiomSkeleton />}>
        <ServerIdiomSection />
      </Suspense>

      <Suspense fallback={<CategorySkeleton />}>
        <ServerCategorySection />
      </Suspense>
    </HomeClientView>
  );
}
