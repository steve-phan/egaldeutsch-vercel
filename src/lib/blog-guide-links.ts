import { QuizQuestion } from "@/types/quiz";

type BlogGuideLink = {
  href: string;
  label: string;
};

const CATEGORY_GUIDES: Record<string, BlogGuideLink> = {
  adjektivendungen: {
    href: "/blogs/adjektivdeklination",
    label: "Adjective declension guide",
  },
  konjunktiv: {
    href: "/blogs/konjunktiv2",
    label: "Konjunktiv II guide",
  },
  genitiv: {
    href: "/blogs/genitiv",
    label: "Genitiv guide",
  },
  "n-deklination": {
    href: "/blogs/n-deklination",
    label: "N-Deklination guide",
  },
  passiv: {
    href: "/blogs/passiv",
    label: "Passive voice guide",
  },
  praepositionen: {
    href: "/blogs/wechselpraepositionen",
    label: "Two-way prepositions guide",
  },
  relativsaetze: {
    href: "/blogs/relativsaetze",
    label: "Relative clauses guide",
  },
  "trennbare-verben": {
    href: "/blogs/trennbare-verben",
    label: "Separable verbs guide",
  },
  "verb-konjugation": {
    href: "/blogs/modalverben",
    label: "Modal verbs guide",
  },
  wortstellung: {
    href: "/blogs/konnektoren",
    label: "Sentence connectors guide",
  },
};

const TAG_GUIDES: Record<string, BlogGuideLink> = {
  akkusativ: {
    href: "/blogs/akkusativ",
    label: "Akkusativ guide",
  },
  dativ: {
    href: "/blogs/dativ",
    label: "Dativ guide",
  },
  genitive: {
    href: "/blogs/genitiv",
    label: "Genitiv guide",
  },
  genitiv: {
    href: "/blogs/genitiv",
    label: "Genitiv guide",
  },
  modal: {
    href: "/blogs/modalverben",
    label: "Modal verbs guide",
  },
  modals: {
    href: "/blogs/modalverben",
    label: "Modal verbs guide",
  },
  perfekt: {
    href: "/blogs/perfekt-praeteritum",
    label: "German past tense guide",
  },
  praeteritum: {
    href: "/blogs/perfekt-praeteritum",
    label: "German past tense guide",
  },
  präteritum: {
    href: "/blogs/perfekt-praeteritum",
    label: "German past tense guide",
  },
};

const BLOG_QUIZ_GUIDES: Record<string, BlogGuideLink> = {
  adjektivdeklination: {
    href: "/quiz/adjektivendungen",
    label: "Practice adjective endings",
  },
  akkusativ: {
    href: "/quiz/kasus",
    label: "Practice German cases",
  },
  dativ: {
    href: "/quiz/kasus",
    label: "Practice German cases",
  },
  genitiv: {
    href: "/quiz/kasus",
    label: "Practice German cases",
  },
  konjunktiv2: {
    href: "/quiz/konjunktiv",
    label: "Practice Konjunktiv II",
  },
  konnektoren: {
    href: "/quiz/wortstellung",
    label: "Practice word order",
  },
  modalverben: {
    href: "/quiz/verb-konjugation",
    label: "Practice modal verbs",
  },
  "n-deklination": {
    href: "/quiz/kasus",
    label: "Practice German cases",
  },
  passiv: {
    href: "/quiz/passiv",
    label: "Practice passive voice",
  },
  "perfekt-praeteritum": {
    href: "/quiz/verb-konjugation",
    label: "Practice verb forms",
  },
  plusquamperfekt: {
    href: "/quiz/verb-konjugation",
    label: "Practice verb forms",
  },
  reflexivverben: {
    href: "/quiz/verb-konjugation",
    label: "Practice verb forms",
  },
  relativsaetze: {
    href: "/quiz/relativsaetze",
    label: "Practice relative clauses",
  },
  "trennbare-verben": {
    href: "/quiz/trennbare-verben",
    label: "Practice separable verbs",
  },
  wechselpraepositionen: {
    href: "/quiz/praepositionen",
    label: "Practice two-way prepositions",
  },
};

export function getBlogGuideForQuestion(question: QuizQuestion): BlogGuideLink {
  const searchTerms = [question.subcategory, ...question.tags].map((term) => term.toLowerCase());
  const tagGuide = searchTerms.map((term) => TAG_GUIDES[term]).find(Boolean);

  return tagGuide ?? CATEGORY_GUIDES[question.category] ?? {
    href: "/blogs",
    label: "Grammar theory library",
  };
}

export function getQuizGuideForBlogSlug(slug: string): BlogGuideLink {
  return BLOG_QUIZ_GUIDES[slug] ?? {
    href: "/practice",
    label: "Start practice quiz",
  };
}
