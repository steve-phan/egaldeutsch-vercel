"use client";

import { useState } from "react";
import { QuizQuestion, CEFRLevel, QuizType } from "@/types/quiz";
import { OptionsEditor } from "./options-editor";
import { TagsInput } from "./tags-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, X, Lightbulb, Target, Settings, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { QuestionPreview } from "./question-preview";
import { Card } from "@/components/shared/layout/card";

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
  prompt_de: "",
  explanation_de: "", explanation_en: "", explanation_vi: "",
  correct_answer: "",
  options: [],
  tags: [],
  status: "draft"
};

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2"];
const TYPES: QuizType[] = ["multiple-choice", "fill-in-blank", "word-order"];

export function QuestionForm({ initialData, onSubmit, isSubmitting }: QuestionFormProps) {
  const [formData, setFormData] = useState<Partial<QuizQuestion>>({
    ...DEFAULT_QUESTION,
    ...initialData
  });

  const updateField = (
    field: keyof QuizQuestion,
    value: Partial<QuizQuestion>[keyof QuizQuestion],
  ) => {
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
        <Card padding="lg" radius="3xl" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Settings className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none">Mission Metadata</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Classification & Logic</p>
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
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</Label>
                <select 
                  value={formData.status} 
                  onChange={e => updateField("status", e.target.value)}
                  className={`w-full h-12 px-4 rounded-2xl border font-black text-xs uppercase tracking-widest shadow-sm outline-none transition-all
                    ${formData.status === 'published' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 
                      formData.status === 'review' ? 'border-amber-100 bg-amber-50 text-amber-600' : 
                      'border-slate-100 bg-white text-slate-400'}
                  `}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                </select>
            </div>
          </div>
        </Card>

        {/* 2. Practice Text */}
        <Card padding="lg" radius="3xl" className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none">Practice Text</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Read-only learner prompt</p>
              </div>
          </div>

          <div
            aria-disabled="true"
            className="min-h-24 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base font-bold leading-7 text-slate-500 shadow-inner select-text"
          >
            {formData.prompt_de?.trim() || (
              <span className="text-slate-300">
                Practice text will appear here when the question has a German prompt.
              </span>
            )}
          </div>
        </Card>

        {/* 2. Evaluation Logic */}
        <Card padding="lg" radius="3xl" className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none">Mastery Target</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Correct Answer & Options</p>
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
        </Card>

        {/* 3. Feedback & Explanations */}
        <Card padding="lg" radius="3xl" className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic leading-none">Educational Feedback</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Explanations & Enrichment</p>
              </div>
          </div>
          <TagsInput 
              tags={formData.tags || []} 
              onChange={tags => updateField("tags", tags)} 
          />
        </Card>

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
         
         <Card radius="xl" padding="md" className="mt-10 space-y-4">
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
         </Card>
      </div>
    </div>
  );
}
