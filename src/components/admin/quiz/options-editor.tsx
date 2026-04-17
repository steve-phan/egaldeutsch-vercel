import { QuizOption } from "@/types/quiz";
import { LocalizedTextField } from "./localized-text-field";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface OptionsEditorProps {
  options: QuizOption[];
  onChange: (options: QuizOption[]) => void;
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}

export function OptionsEditor({ options, onChange, correctAnswer, onCorrectAnswerChange }: OptionsEditorProps) {
  
  const handleUpdate = (idx: number, lang: "de" | "en" | "vi", val: string) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], [lang]: val };
    onChange(newOptions);
  };

  const addOption = () => {
    if (options.length >= 4) return;
    onChange([...options, { de: "", en: "", vi: "" }]);
  };

  const removeOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    onChange(newOptions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">MCQ Options (For multiple-choice only)</h3>
        <Button onClick={addOption} disabled={options.length >= 4} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Option
        </Button>
      </div>

      <div className="space-y-6">
        {options.map((opt, idx) => {
          // A radio button to easily select this option as the correct answer
          const isCorrect = correctAnswer === opt.de && opt.de !== "";

          return (
            <div key={idx} className="relative bg-white p-4 rounded-xl border-2 border-slate-200">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                     <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                     </span>
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="radio" 
                         name="correct-answer" 
                         checked={isCorrect}
                         onChange={() => onCorrectAnswerChange(opt.de)}
                         className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                       />
                       <span className={`text-sm font-semibold ${isCorrect ? "text-green-600" : "text-slate-600"}`}>
                         Valid Answer
                       </span>
                     </label>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
               
               <LocalizedTextField 
                 label={`Option ${idx + 1} Text`}
                 deValue={opt.de}
                 enValue={opt.en}
                 viValue={opt.vi}
                 onDeChange={(v) => handleUpdate(idx, "de", v)}
                 onEnChange={(v) => handleUpdate(idx, "en", v)}
                 onViChange={(v) => handleUpdate(idx, "vi", v)}
               />
            </div>
          );
        })}

        {options.length === 0 && (
           <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
             No options added yet. Ensure the question type requires options.
           </div>
        )}
      </div>
    </div>
  );
}
