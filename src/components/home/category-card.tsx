"use client";

import { CategoryMeta } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  category: CategoryMeta;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { language } = useLanguage();

  const getLabel = () => {
    switch (language) {
      case "de": return category.label.de;
      case "vi": return category.label.vi;
      case "en":
      default: return category.label.en;
    }
  };

  return (
    <Card className="min-w-[280px] w-[280px] h-[240px] rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden group">
      <CardContent className="p-8 flex flex-col h-full relative">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-xl font-black text-slate-800 leading-tight">
              {getLabel()}
           </h3>
           <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              {category.icon}
           </div>
        </div>
        
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider mb-auto">
          {category.levels.join(" • ")}
        </p>
        
        <Link href={`/quiz/${category.id}`} className="block w-full">
          <Button variant="default" className="w-full h-12 text-sm font-black btn-orange">
             {language === "de" ? "Jetzt lernen" : language === "vi" ? "Bắt đầu học" : "Learn More"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
