import { CategoryMeta } from "@/types/quiz";
import { CategoryCard } from "./category-card";

interface CategoryGridProps {
  categories: CategoryMeta[];
  loading?: boolean;
}

export function CategoryGrid({ categories, loading }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
         {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-xl border border-slate-200" />
         ))}
      </div>
    );
  }

  if (categories.length === 0) {
     return (
        <div className="w-full text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl">
           <div className="text-4xl mb-4 opacity-50">🔍</div>
           <h3 className="text-xl font-bold text-slate-700">No categories found</h3>
           <p className="text-slate-500 mt-2">Try selecting a different level.</p>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
      {categories.map((cat, i) => (
        <div 
           key={cat.id} 
           className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards"
           style={{ animationDelay: `${i * 100}ms` }}
        >
           <CategoryCard category={cat} />
        </div>
      ))}
    </div>
  );
}
