"use client";

import { QuizQuestion } from "@/types/quiz";
import { Edit2, Trash2, FileText, Type, ListOrdered, Layers } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/shared/layout/card";

interface QuestionTableProps {
  questions: QuizQuestion[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function QuestionTable({ questions, onDelete, isDeleting }: QuestionTableProps) {

  if (questions.length === 0) {
    return (
      <Card padding="xl" radius="3xl" className="text-center animate-in zoom-in-95 duration-700">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching records found in database.</p>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "multiple-choice": return <Type className="w-4 h-4" />;
      case "fill-in-blank": return <FileText className="w-4 h-4" />;
      case "word-order": return <ListOrdered className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <Card
          key={q.id}
          padding="md"
          radius="2xl"
          hover
          className="flex flex-col md:flex-row items-center justify-between gap-6 group animate-in slide-in-from-left-4 duration-500"
        >
          <div className="flex items-center gap-6 flex-1 w-full">
            {/* Level & Type Indicators */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                {getTypeIcon(q.type)}
              </div>
              <div className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest">{q.level}</div>
            </div>

            {/* Content Context */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{q.category}</span>
                {q.subcategory && (
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">• {q.subcategory}</span>
                )}
                <span className={`
                    ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border
                    ${q.status === 'published' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                    q.status === 'review' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                      'bg-slate-50 text-slate-400 border-slate-100'}
                 `}>
                  {q.status || 'draft'}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight italic decoration-primary/30 underline-offset-4 group-hover:underline">
                {q.prompt_de.replace(/___/g, "______")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <Link href={`/admin/questions/${q.id}`}>
              <button className="h-11 px-6 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/20 shadow-sm transition-all flex items-center gap-2">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </Link>
            <button
              onClick={() => {
                if (confirm("Delete this mission from the database?")) onDelete(q.id);
              }}
              disabled={isDeleting}
              className="h-11 w-11 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm border border-rose-100"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
