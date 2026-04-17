"use client";

import { useLanguage } from "@/contexts/language-context";

export function CourseCompletion() {
  const { language } = useLanguage();
  const data = [10, 20, 30, 15, 25, 35, 20];
  const days = ["M", "D", "M", "D", "F", "S", "S"];

  return (
    <div className="glass-card-premium rounded-[2.5rem] p-6 flex flex-col justify-between h-full relative group overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="mb-4 relative z-10">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
          {language === "de" ? "Aktivität" : language === "vi" ? "Hoạt động" : "Activity"}
        </h3>
        <p className="text-2xl font-black text-slate-800 tracking-tighter">7.2h this week</p>
      </div>
      
      <div className="flex items-end justify-between h-24 gap-1.5 relative z-10">
        {data.map((val, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-2 group/bar">
            <div className="w-full bg-slate-50 rounded-full h-full relative overflow-hidden flex items-end">
               <div 
                 className="w-full bg-primary rounded-full transition-all duration-700 ease-out shadow-sm shadow-primary/20"
                 style={{ height: `${val * 2}%` }}
               />
            </div>
            <span className="text-[10px] font-black text-slate-300 group-hover/bar:text-primary transition-colors">
              {days[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
