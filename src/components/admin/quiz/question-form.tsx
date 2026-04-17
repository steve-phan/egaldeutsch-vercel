import { useState } from "react";
import { QuizQuestion, CEFRLevel, QuizType, QuizCategory } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { LocalizedTextField } from "./localized-text-field";
import { OptionsEditor } from "./options-editor";
import { TagsInput } from "./tags-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionFormProps {
  initialData?: Partial<QuizQuestion>;
  onSubmit: (data: Partial<QuizQuestion>) => Promise<void>;
  isSubmitting: boolean;
}

const DEFAULT_QUESTION: Partial<QuizQuestion> = {
  category: "artikel",
  subcategory: "general",
  level: "A1",
  type: "multiple-choice",
  prompt_de: "", prompt_en: "", prompt_vi: "",
  explanation_de: "", explanation_en: "", explanation_vi: "",
  correct_answer: "",
  options: [],
  tags: []
};

// Available enums for selects
const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];
const TYPES: QuizType[] = ["multiple-choice", "fill-in-blank", "word-order"];

export function QuestionForm({ initialData, onSubmit, isSubmitting }: QuestionFormProps) {
  const [formData, setFormData] = useState<Partial<QuizQuestion>>({
    ...DEFAULT_QUESTION,
    ...initialData
  });

  const updateField = (field: keyof QuizQuestion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
       
      {/* 1. Meta Information */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <h2 className="text-xl font-extrabold text-slate-800 border-b pb-4">1. Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
              <Label>Category ID</Label>
              <Input 
                 value={formData.category} 
                 onChange={e => updateField("category", e.target.value)} 
                 placeholder="e.g. artikel" 
              />
           </div>
           <div className="space-y-2">
              <Label>Subcategory (Optional)</Label>
              <Input 
                 value={formData.subcategory} 
                 onChange={e => updateField("subcategory", e.target.value)} 
                 placeholder="e.g. akkusativ" 
              />
           </div>
           <div className="space-y-2">
              <Label>CEFR Level</Label>
              <select 
                 value={formData.level} 
                 onChange={e => updateField("level", e.target.value)}
                 className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
              >
                 {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <Label>Interaction Type</Label>
              <select 
                 value={formData.type} 
                 onChange={e => updateField("type", e.target.value)}
                 className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
              >
                 {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
           </div>
        </div>
      </section>

      {/* 2. Prompt Details */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-xl font-extrabold text-slate-800 border-b pb-4">2. The Question</h2>
         <p className="text-sm text-slate-500">
           Use <code className="bg-slate-100 px-1 py-0.5 rounded">___</code> to indicate a blank space for fill-in-the-blank questions.
         </p>
         <LocalizedTextField 
            label="Prompt Text"
            deValue={formData.prompt_de || ""}
            enValue={formData.prompt_en || ""}
            viValue={formData.prompt_vi || ""}
            onDeChange={v => updateField("prompt_de", v)}
            onEnChange={v => updateField("prompt_en", v)}
            onViChange={v => updateField("prompt_vi", v)}
            multiline
         />
      </section>

      {/* 3. Expected Answers & Options */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-xl font-extrabold text-slate-800 border-b pb-4">3. Evaluation</h2>
         <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <Label className="text-amber-900 font-bold mb-2 block">Correct Answer (Canonical Text in German)</Label>
            <Input 
               value={formData.correct_answer} 
               onChange={e => updateField("correct_answer", e.target.value)} 
               placeholder="The exact string to evaluate against..."
               className="border-amber-300 focus-visible:ring-amber-500 bg-white"
            />
         </div>

         {formData.type === "multiple-choice" && (
            <OptionsEditor 
               options={formData.options || []} 
               onChange={opts => updateField("options", opts)}
               correctAnswer={formData.correct_answer || ""}
               onCorrectAnswerChange={val => updateField("correct_answer", val)}
            />
         )}
      </section>

      {/* 4. Explanations & Tags */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
         <h2 className="text-xl font-extrabold text-slate-800 border-b pb-4">4. Review & Extras</h2>
         <LocalizedTextField 
            label="Explanation Text (Shown after answer)"
            deValue={formData.explanation_de || ""}
            enValue={formData.explanation_en || ""}
            viValue={formData.explanation_vi || ""}
            onDeChange={v => updateField("explanation_de", v)}
            onEnChange={v => updateField("explanation_en", v)}
            onViChange={v => updateField("explanation_vi", v)}
            multiline
         />
         <TagsInput 
            tags={formData.tags || []} 
            onChange={tags => updateField("tags", tags)} 
         />
      </section>

      {/* Submit */}
      <div className="flex justify-end gap-4 sticky bottom-6 p-4 bg-white/80 backdrop-blur border rounded-2xl shadow-lg">
         <Button type="button" variant="outline" size="lg">Cancel</Button>
         <Button type="submit" size="lg" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 px-8">
            {isSubmitting ? "Saving..." : "Save Question"}
         </Button>
      </div>

    </form>
  );
}
