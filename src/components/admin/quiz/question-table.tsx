import { QuizQuestion } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface QuestionTableProps {
  questions: QuizQuestion[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function QuestionTable({ questions, onDelete, isDeleting }: QuestionTableProps) {

  if (questions.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
         <p className="text-slate-500 text-lg">No questions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Prompt (DE)</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <Badge variant="outline" className="font-bold border-indigo-200 text-indigo-700 bg-white">
                    {q.level}
                  </Badge>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-semibold text-slate-800">{q.category}</div>
                    {q.subcategory && <div className="text-xs text-slate-400">{q.subcategory}</div>}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-slate-800 font-medium line-clamp-2">
                    {q.prompt_de.replace(/___/g, "___ (blank)")}
                  </p>
                </td>
                <td className="p-4">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {q.type.replace("-", " ")}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                     <Link href={`/admin/questions/${q.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-indigo-600 hover:text-indigo-800">
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                     </Link>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                       disabled={isDeleting}
                       onClick={() => {
                         if (confirm("Are you sure you want to delete this question?")) {
                           onDelete(q.id);
                         }
                       }}
                     >
                        <Trash2 className="w-3.5 h-3.5" />
                     </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
