// Category progress item — shows per-category quiz stats
// Will be fully rebuilt in Phase 6 with real data from /api/dashboard

interface CategoryProgressProps {
  category: string;
  avgScore: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  "artikel":            "🏷️ Artikel (der/die/das)",
  "kasus":              "📐 Kasus",
  "praepositionen":     "📍 Präpositionen",
  "verb-konjugation":   "⚡ Verb Konjugation",
  "adjektivendungen":   "✏️ Adjektivendungen",
  "negation":           "🚫 Negation",
  "relativsaetze":      "🔗 Relativsätze",
  "konjunktionen":      "🔀 Konjunktionen",
  "passiv":             "🔄 Passiv",
  "konjunktiv":         "💭 Konjunktiv",
  "wortstellung":       "📋 Wortstellung",
  "trennbare-verben":   "✂️ Trennbare Verben",
  "n-deklination":      "📖 N-Deklination",
  "praepositionalverben":"🎯 Präpositionalverben",
  "genitiv":            "🔑 Genitiv",
};

export function CategoryProgress({ category, avgScore }: CategoryProgressProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const pct = Math.round(avgScore);
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <div className="mt-1 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="text-sm font-semibold w-12 text-right text-slate-600">{pct}%</span>
    </div>
  );
}
