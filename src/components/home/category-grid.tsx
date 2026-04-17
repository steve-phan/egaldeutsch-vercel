"use client";

import { CategoryMeta } from "@/types/quiz";
import { CategoryCard } from "./category-card";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryGridProps {
  categories: CategoryMeta[];
  loading?: boolean;
}

export function CategoryGrid({ categories, loading }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="min-w-[280px] h-[240px] rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full p-12 text-center glass-card rounded-[2rem]">
        <p className="text-slate-400 font-bold">No categories found for this level.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar pt-2">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
