import { useLanguage } from "@/contexts/language-context";

interface LevelSelectorProps {
  selectedLevel: string;
  onSelectLevel: (level: string) => void;
}

export function LevelSelector({ selectedLevel, onSelectLevel }: LevelSelectorProps) {
  const { language } = useLanguage();

  const getAllLabel = () => {
     switch (language) {
        case "de": return "Alle Niveaus";
        case "vi": return "Tất cả trình độ";
        case "en":
        default: return "All Levels";
     }
  };

  const levels = [
     { id: "all", label: getAllLabel() },
     { id: "A1", label: "A1 (Beginner)" },
     { id: "A2", label: "A2 (Elementary)" },
     { id: "B1", label: "B1 (Intermediate)" },
     { id: "B2", label: "B2 (Upper Int.)" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-full border border-slate-100/50 backdrop-blur-sm w-max self-start lg:self-center">
      {levels.map((level) => {
        const isSelected = selectedLevel === level.id;
        
        return (
           <button
             key={level.id}
             onClick={() => onSelectLevel(level.id)}
             className={`
               px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300
               ${isSelected 
                  ? "bg-white text-primary shadow-premium" 
                  : "text-slate-400 hover:text-slate-600"}
             `}
           >
              {level.label}
           </button>
        );
      })}
    </div>
  );
}
