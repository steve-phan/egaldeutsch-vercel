"use client";

import { useState } from "react";
import { QuizQuestion, CEFRLevel, QuizType } from "@/types/quiz";
import { LocalizedTextField } from "./localized-text-field";
import { OptionsEditor } from "./options-editor";
import { TagsInput } from "./tags-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Save, X, Lightbulb, Target, Settings, Globe } from "lucide-react";
import Link from "next/link";

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
    <div className="flex flex-col lg:flex-row gap-10 items-start pb-20">
      <form onSubmit={handleSave} className="flex-1 space-y-12 w-full">
        
        {/* 1. Meta Information */}
        <section className="glass-card-premium p-8 md:p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Settings className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Mission Metadata</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classification & Logic</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</Label>
                <Input 
                  value={formData.category} 
                  onChange={e => updateField("category", e.target.value)} 
                  placeholder="artikel" 
                  className="h-12 rounded-2xl border-slate-100 shadow-sm font-bold"
                />
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subcategory</Label>
                <Input 
                  value={formData.subcategory} 
                  onChange={e => updateField("subcategory", e.target.value)} 
                  placeholder="akkusativ" 
                  className="h-12 rounded-2xl border-slate-100 shadow-sm font-bold"
                />
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CEFR Level</Label>
                <select 
                  value={formData.level} 
                  onChange={e => updateField("level", e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-white font-black text-xs uppercase tracking-widest shadow-sm outline-none transition-all"
                >
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interaction</Label>
                <select 
                  value={formData.type} 
                  onChange={e => updateField("type", e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-white font-black text-xs uppercase tracking-widest shadow-sm outline-none transition-all"
                >
                  {TYPES.map(t => <option key={t} value={t}>{t.replace("-", " ")}</option>)}
                </select>
            </div>
          </div>
        </section>

        {/* 2. Language Content */}
        <section className="glass-card-premium p-8 md:p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Multilingual Prompt</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question Text (DE / EN / VI)</p>
              </div>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="w-3 h-3 text-amber-500" /> Pro Tip: Use <code className="bg-white px-1.5 py-0.5 rounded shadow-sm text-primary">___</code> for blanks.
              </p>
          </div>

          <LocalizedTextField 
              label=""
              deValue={formData.prompt_de || ""}
              enValue={formData.prompt_en || ""}
              viValue={formData.prompt_vi || ""}
              onDeChange={v => updateField("prompt_de", v)}
              onEnChange={v => updateField("prompt_en", v)}
              onViChange={v => updateField("prompt_vi", v)}
              multiline
          />
        </section>

        {/* 3. Evaluation Logic */}
        <section className="glass-card-premium p-8 md:p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Mastery Target</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correct Answer & Options</p>
              </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <Label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Canonical Correct Answer</Label>
              <Input 
                value={formData.correct_answer} 
                onChange={e => updateField("correct_answer", e.target.value)} 
                placeholder="The exact expected German string..."
                className="h-12 rounded-xl border-emerald-100 shadow-sm font-black text-slate-800 bg-white focus:ring-emerald-500/20"
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

        {/* 4. Feedback & Explanations */}
        <section className="glass-card-premium p-8 md:p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">Educational Feedback</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Explanations & Enrichment</p>
              </div>
          </div>

          <LocalizedTextField 
              label="Explanation (DE / EN / VI)"
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

        {/* Sticky Action Bar */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="glass-navigation rounded-full p-2 flex items-center gap-2 border border-white shadow-floating">
              <Link href="/admin" className="flex-1">
                <button type="button" className="w-full h-12 flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors bg-white/50 rounded-full">
                    <X className="w-4 h-4" /> Discard
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-[2] btn-orange h-12 rounded-full flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Persisting..." : "Commit Changes"} 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
        </div>
      </form>

      {/* Live Preview Sidebar */}
      <div className="hidden lg:block w-96 sticky top-10 animate-in slide-in-from-right-4 duration-1000 delay-300">
         <div className="flex items-center gap-2 mb-6 ml-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] italic">Live Preview</h3>
         </div>
         <QuestionPreview question={formData} />
         
         <div className="mt-10 p-6 glass-card-premium rounded-3xl border border-white/50 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editorial Checklist</h4>
            <div className="space-y-3">
               {[
                  "German prompt is natural",
                  "Correct answer matches options",
                  "Explanations are helpful",
                  "Target level is appropriate"
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full border border-slate-200" />
                     <span className="text-[10px] font-bold text-slate-500">{item}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
