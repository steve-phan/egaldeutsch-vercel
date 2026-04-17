import { QuizOption } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface OptionsEditorProps {
  options: QuizOption[];
  onChange: (options: QuizOption[]) => void;
  correctAnswer: string;
  onCorrectAnswerChange: (answer: string) => void;
}

export function OptionsEditor({ options, onChange, correctAnswer, onCorrectAnswerChange }: OptionsEditorProps) {
  
  const handleUpdate = (idx: number, val: string) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    onChange(newOptions);
  };

  const addOption = () => {
    if (options.length >= 4) return;
    onChange([...options, ""]);
  };

  const removeOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    onChange(newOptions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">MCQ Options (DE only)</h3>
        <Button onClick={addOption} disabled={options.length >= 4} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Option
        </Button>
      </div>

      <div className="space-y-6">
        {options.map((opt, idx) => {
          const isCorrect = correctAnswer === opt && opt !== "";

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
                         onChange={() => onCorrectAnswerChange(opt)}
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

               <div className="space-y-3">
                  <Input 
                    value={opt} 
                    onChange={e => handleUpdate(idx, e.target.value)} 
                    placeholder="German option text..."
                    className="h-11 rounded-xl border-slate-100 font-bold"
                  />
               </div>
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
