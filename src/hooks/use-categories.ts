import { useState, useCallback, useEffect } from "react";
import { QuizCategory, CategoryMeta } from "@/types/quiz";

interface UseCategoriesResult {
  stats: Record<string, Record<string, number>>;
  loading: boolean;
  error: string | null;
  getCategoriesByLevel: (level: string) => CategoryMeta[];
  getAllCategories: () => CategoryMeta[];
}

// Meta definitions for all categories supported by the platform
const CATEGORY_META: CategoryMeta[] = [
  {
    id: "artikel",
    label: { de: "Artikel", en: "Articles (der/die/das)", vi: "Mạo từ (der/die/das)" },
    description: {
      de: "Bestimmte und unbestimmte Artikel im Deutschen.",
      en: "Definite and indefinite articles in German.",
      vi: "Mạo từ xác định và không xác định trong tiếng Đức."
    },
    icon: "🏷️",
    levels: ["A1"],
    question_counts: {}
  },
  {
    id: "verb-konjugation",
    label: { de: "Verb-Konjugation", en: "Verb Conjugation", vi: "Chia động từ" },
    description: {
      de: "Regelmäßige und unregelmäßige Verben in Präsens und Präteritum.",
      en: "Regular and irregular verbs in present and past tense.",
      vi: "Động từ hợp quy tắc và bất quy tắc ở thì hiện tại và quá khứ."
    },
    icon: "⚡",
    levels: ["A1"],
    question_counts: {}
  },
  {
    id: "negation",
    label: { de: "Negation", en: "Negation (nicht/kein)", vi: "Phủ định (nicht/kein)" },
    description: {
      de: "Verneinung mit 'nicht' und 'kein'.",
      en: "Negation using 'nicht' and 'kein'.",
      vi: "Phủ định bằng 'nicht' và 'kein'."
    },
    icon: "🚫",
    levels: ["A1"],
    question_counts: {}
  },
  {
    id: "kasus",
    label: { de: "Kasus (Fälle)", en: "German Cases", vi: "Cách trong tiếng Đức" },
    description: {
      de: "Nominativ, Akkusativ, Dativ und Genitiv.",
      en: "Nominative, Accusative, Dative, and Genitive cases.",
      vi: "Danh cách, Đối cách, Tặng cách và Sở hữu cách."
    },
    icon: "📐",
    levels: ["A2"],
    question_counts: {}
  },
  {
    id: "praepositionen",
    label: { de: "Präpositionen", en: "Prepositions", vi: "Giới từ" },
    description: {
      de: "Wechselpräpositionen, Präpositionen mit Dativ und Akkusativ.",
      en: "Two-way prepositions, prepositions with Dative and Accusative.",
      vi: "Giới từ hai chiều, giới từ đi với Tặng cách và Đối cách."
    },
    icon: "📍",
    levels: ["A2"],
    question_counts: {}
  },
  {
    id: "adjektivendungen",
    label: { de: "Adjektivendungen", en: "Adjective Endings", vi: "Đuôi tính từ" },
    description: {
      de: "Schwache, starke und gemischte Deklination.",
      en: "Weak, strong, and mixed declension.",
      vi: "Biến cách yếu, mạnh và hỗn hợp."
    },
    icon: "✏️",
    levels: ["B1"],
    question_counts: {}
  },
  {
    id: "passiv",
    label: { de: "Passiv", en: "Passive Voice", vi: "Câu bị động" },
    description: {
      de: "Vorgangspassiv und Zustandspassiv.",
      en: "Process passive and state passive.",
      vi: "Bị động quá trình và bị động trạng thái."
    },
    icon: "🔄",
    levels: ["B1"],
    question_counts: {}
  },
  {
    id: "relativsaetze",
    label: { de: "Relativsätze", en: "Relative Clauses", vi: "Mệnh đề quan hệ" },
    description: {
      de: "Relativpronomen und Satzbau.",
      en: "Relative pronouns and sentence structure.",
      vi: "Đại từ quan hệ và cấu trúc câu."
    },
    icon: "🔗",
    levels: ["B1"],
    question_counts: {}
  },
  {
    id: "trennbare-verben",
    label: { de: "Trennbare Verben", en: "Separable Verbs", vi: "Động từ tách rời" },
    description: {
      de: "Verben mit trennbaren Präfixen.",
      en: "Verbs with separable prefixes.",
      vi: "Động từ với tiền tố có thể tách rời."
    },
    icon: "✂️",
    levels: ["B1"],
    question_counts: {}
  },
  {
    id: "konjunktiv",
    label: { de: "Konjunktiv II", en: "Subjunctive II", vi: "Bàng thái cách II" },
    description: {
      de: "Wünsche, Irreale Bedingungen und Höflichkeit.",
      en: "Wishes, unreal conditions, and politeness.",
      vi: "Mong ước, điều kiện không có thực và sự lịch sự."
    },
    icon: "💭",
    levels: ["B2"],
    question_counts: {}
  },
  {
    id: "wortstellung",
    label: { de: "Wortstellung", en: "Word Order", vi: "Trật tự từ" },
    description: {
      de: "Hauptsätze, Nebensätze und TEKAMOLO.",
      en: "Main clauses, subordinate clauses, and TEKAMOLO rule.",
      vi: "Mệnh đề chính, mệnh đề phụ và quy tắc TEKAMOLO."
    },
    icon: "📋",
    levels: ["B2"],
    question_counts: {}
  }
];

export function useCategories(): UseCategoriesResult {
  const [stats, setStats] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quiz/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const enrichMetaWithStats = (meta: CategoryMeta[]): CategoryMeta[] => {
    return meta.map(cat => {
      const catStats = stats[cat.id] || {};
      return {
        ...cat,
        question_counts: catStats
      };
    });
  };

  const getAllCategories = useCallback(() => {
    return enrichMetaWithStats(CATEGORY_META);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  const getCategoriesByLevel = useCallback((level: string) => {
    if (level === "all") return getAllCategories();
    return enrichMetaWithStats(CATEGORY_META.filter(cat => cat.levels.includes(level as any)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, getAllCategories]);

  return { stats, loading, error, getCategoriesByLevel, getAllCategories };
}
