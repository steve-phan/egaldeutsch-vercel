"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card";

export function CourseCompletion() {
  const { language } = useLanguage();
  const data = [10, 20, 30, 15, 25, 35, 20];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className="rounded-[2rem] border-none shadow-xl shadow-indigo-100/50 bg-white">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-8">
          {language === "de" ? "Kursfortschritt" : language === "vi" ? "Tiến độ khóa học" : "Course completion"}
        </h3>
        
        <div className="flex items-end justify-between h-40 gap-2">
          {data.map((val, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
              <div 
                className="w-full bg-slate-100 rounded-t-lg relative overflow-hidden group-hover:bg-slate-200 transition-colors"
                style={{ height: `${val * 2}px` }}
              >
                <div 
                  className="absolute bottom-0 left-0 w-full bg-primary/40 rounded-t-lg"
                  style={{ height: `${val * 1.5}px` }}
                />
                <div 
                  className="absolute bottom-0 left-0 w-full bg-primary rounded-t-lg transition-all duration-500"
                  style={{ height: `${val}px` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {days[i]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
