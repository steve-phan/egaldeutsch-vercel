import { Metadata } from "next";
import { QuizClientView } from "@/components/quiz/quiz-client-view";
import { CATEGORY_META } from "@/lib/constants";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META.find(c => c.id === category);

  if (!meta) {
    return {
      title: "German Quiz Module",
      description: "Practice German grammar with interactive quizzes."
    };
  }

  return {
    title: `Master ${meta.label.en} — German Grammar Quiz`,
    description: meta.description.en,
    keywords: [...(meta.keywords || []), "German Quiz", "Grammar Practice"],
    alternates: {
      canonical: `/quiz/${category}`,
    },
    openGraph: {
      title: `Practice ${meta.label.en} on EgalDeutsch`,
      description: `Test your skills in ${meta.label.en}. Interactive German grammar practice for all levels.`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `German Grammar Quiz: ${meta.label.en}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `German Grammar Quiz: ${meta.label.en}`,
      description: meta.description.en,
      images: ["/og-image.png"],
    },
  };
}

export default async function QuizOrchestrator({ params }: Props) {
  const { category } = await params;
  return <QuizClientView category={category} />;
}
