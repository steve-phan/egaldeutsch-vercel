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
    <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-max">
      {levels.map((level) => {
        const isSelected = selectedLevel === level.id;
        
        return (
           <button
             key={level.id}
             onClick={() => onSelectLevel(level.id)}
             className={`
               px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
               ${isSelected 
                  ? "bg-white text-indigo-700 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}
             `}
           >
              {level.label}
           </button>
        );
      })}
    </div>
  );
}
