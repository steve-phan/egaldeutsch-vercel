import { CategoryMeta } from "@/types/quiz";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

  const getDescription = () => {
    switch (language) {
      case "de": return category.description.de;
      case "vi": return category.description.vi;
      case "en":
      default: return category.description.en;
    }
  };

  const totalQuestions = Object.values(category.question_counts).reduce((a, b) => a + (b || 0), 0);

  return (
    <Link href={`/quiz/${category.id}`}>
      <Card className="h-full border-2 border-slate-200 hover:border-indigo-400 transition-all hover:shadow-lg hover:-translate-y-1 bg-white cursor-pointer group flex flex-col">
        <CardContent className="p-6 flex flex-col h-full">
           <div className="flex justify-between items-start mb-4">
              <div className="text-4xl bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                 {category.icon}
              </div>
              <div className="flex gap-1">
                 {category.levels.map(l => (
                    <Badge key={l} variant="outline" className="text-xs bg-white text-indigo-700 border-indigo-200 font-bold">
                       {l}
                    </Badge>
                 ))}
              </div>
           </div>
           
           <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
              {getLabel()}
           </h3>
           
           <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
              {getDescription()}
           </p>
           
           <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                 <BookOpen className="w-3.5 h-3.5" />
                 {totalQuestions} {language === "de" ? "Fragen" : language === "vi" ? "Câu hỏi" : "Questions"}
              </span>
              <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                 <ArrowRight className="w-5 h-5" />
              </span>
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
