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
    openGraph: {
      title: `Practice ${meta.label.en} on EgalDeutsch`,
      description: `Test your skills in ${meta.label.en}. Interactive German grammar practice for all levels.`,
      type: "website",
    }
  };
}

export default async function QuizOrchestrator({ params }: Props) {
  const { category } = await params;
  return <QuizClientView category={category} />;
}
