import { BACKEND_URL, API_ROUTES, CATEGORY_META } from "@/lib/constants";
import { CategoryGrid } from "./category-grid";
import { Card } from "@/components/shared/layout/card";

async function getCategoryStats() {
  try {
    const res = await fetch(`${BACKEND_URL}${API_ROUTES.QUIZ_CATEGORIES}`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return {};
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category stats:", error);
    return {};
  }
}

export async function ServerCategorySection() {
  const stats = await getCategoryStats();
  
  // Transform the stats map into the enriched category array the grid expects
  const enrichedCategories = CATEGORY_META.map(cat => ({
    ...cat,
    question_counts: stats[cat.id] || {}
  }));
  
  return (
    <Card className="space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none pb-3">Grammar Modules</h2>
        <div className="h-0.5 flex-1 bg-slate-100/50 rounded-full" />
      </div>
      <CategoryGrid categories={enrichedCategories} loading={false} />
    </Card>
  );
}
