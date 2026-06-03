import { CategoryMeta } from "@/types/quiz";

export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

type QueryValue = string | number | boolean | null | undefined;
export type ApiRequestOptions = RequestInit & {
  json?: boolean;
  query?: Record<string, QueryValue> | URLSearchParams;
  token?: string;
};

export function apiUrl(
  route: string,
  query?: Record<string, QueryValue> | URLSearchParams,
) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const url = new URL(`${BACKEND_URL}${normalizedRoute}`);

  if (query instanceof URLSearchParams) {
    query.forEach((value, key) => {
      if (value !== "") url.searchParams.set(key, value);
    });
  } else if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export function apiRequest(
  route: string,
  { json, query, token, headers, ...init }: ApiRequestOptions = {},
) {
  const requestHeaders = new Headers(headers);

  if (json && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  return fetch(apiUrl(route, query), {
    ...init,
    headers: requestHeaders,
  });
}

export const API_ROUTES = {
  // Auth
  LOGIN: "/api/account/login",
  SIGNUP: "/api/account/signup",
  GOOGLE_SYNC: "/api/account/google-sync",
  FORGOT_PASSWORD: "/api/account/forgot-password",
  RESET_PASSWORD: "/api/account/reset-password",
  USER_PROFILE: "/api/account/user",
  CHANGE_PASSWORD: "/api/account/change-password",
  DELETE_REQUEST: "/api/account/delete-request",
  DELETE_CONFIRM: "/api/account/delete-confirm",

  // User
  NOTIFICATIONS: "/api/user/notifications",
  NOTIFICATIONS_READ: "/api/user/notifications/read",
  
  // Dashboard & Stats
  DASHBOARD: "/api/dashboard",
  
  // Quiz & Content
  QUIZ_CATEGORIES: "/api/quiz/categories",
  QUIZ_QUESTIONS: "/api/quiz/questions",
  QUIZ_SUBMIT: "/api/quiz/submit",
  
  // Admin
  ADMIN_QUESTIONS: "/api/admin/questions",
  ADMIN_USERS: "/api/admin/users",

  // Feedback
  FEEDBACK: "/api/feedback",
  ADMIN_FEEDBACK: "/api/admin/feedback",

  // Idioms
  IDIOMS: "/api/idioms",
  IDIOM_RANDOM: "/api/idioms/random",
  IDIOM_DETAIL: "/api/idioms/",
};

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export const CATEGORY_META: CategoryMeta[] = [
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
    question_counts: {},
    keywords: ["B2 Beruf", "Business German", "TELC Exam Prep"]
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
    question_counts: {},
    keywords: ["TELC B2 Prep", "B2 Beruf", "German for Professionals"]
  },
  {
    id: "mixed",
    label: { de: "Gemischt", en: "Mixed Practice", vi: "Tổng hợp" },
    description: {
      de: "Die ultimative Herausforderung: Alle Grammatikthemen in einer Sitzung.",
      en: "The ultimate challenge: All grammar topics randomized in one session.",
      vi: "Thử thách tối thượng: Tất cả các chủ đề ngữ pháp được trộn ngẫu nhiên."
    },
    icon: "🎲",
    levels: ["A1", "A2", "B1", "B2"],
    question_counts: {},
    keywords: ["All Topics", "Exam Simulation", "Review", "Random Mix"]
  }
];
