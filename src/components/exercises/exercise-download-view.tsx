"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CATEGORY_META, CEFR_LEVELS } from '@/lib/constants';
import { QuizQuestion, QuizCategory, CEFRLevel } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileDown, Eye, Settings2, Sparkles } from 'lucide-react';
import { Section } from '@/components/shared/layout/section';
import { AppShell } from '@/components/layout/app-shell';
import { VisualPageHeader } from '@/components/shared/visual-page-header';
import { cn } from '@/lib/utils';

// Dynamically import PDF components to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="h-[600px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Vorschau wird geladen...</div> }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

// We need to import the template
import { ExercisePDFTemplate } from './exercise-pdf-template';

export function ExerciseDownloadView() {
  const [category, setCategory] = useState<QuizCategory>("artikel");
  const [level, setLevel] = useState<CEFRLevel>("A1");
  const [amount, setAmount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setShowPreview(false);
    try {
      const response = await fetch(`/api/quiz/questions?category=${category}&level=${level}&limit=${amount}`);
      const data = await response.json();
      setQuestions(data);
      setShowPreview(true);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryLabel = CATEGORY_META.find(c => c.id === category)?.label.de || category;

  return (
    <AppShell showNav={true} maxWidth="lg">
      <Section spacing="sm">
        <VisualPageHeader
          title="Material-Download"
          subtitle="Erstelle professionelle Übungsblätter zum Ausdrucken"
          icon={<FileDown className="w-6 h-6" />}
          iconColor="bg-emerald-500"
          backHref="/practice"
          backLabel="Zurück zur Auswahl"
        />
      </Section>

      <Section spacing="md" className="relative">
        {/* Background Decorative Mascot (Floating) */}
        <div className="absolute -right-10 top-0 w-64 h-64 opacity-[0.03] pointer-events-none hidden xl:block grayscale">
          <img src="/mascot.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sidebar: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative rounded-[2.5rem] border-slate-100 shadow-premium overflow-hidden bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50">
                      <Settings2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight italic">Eigenschaften</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Konfiguriere dein PDF</p>
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Fokus-Thema</label>
                    <div className="relative">
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value as QuizCategory)}
                        className="w-full h-14 pl-5 pr-10 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white text-slate-700 font-black tracking-tight transition-all appearance-none cursor-pointer shadow-sm text-sm"
                      >
                        <option value="mixed">🔄 Gemischte Übungen (Alle Themen)</option>
                        {CATEGORY_META.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.label.de}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Level Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Schwierigkeit</label>
                    <div className="grid grid-cols-4 gap-3">
                      {CEFR_LEVELS.map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setLevel(lvl)}
                          className={cn(
                            "h-12 rounded-2xl font-black text-xs transition-all border-2",
                            level === lvl 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105 active:scale-95' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Umfang</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[10, 20, 30].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setAmount(amt)}
                          className={cn(
                            "h-12 rounded-2xl font-black text-xs transition-all border-2",
                            amount === amt 
                            ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-800/20 scale-105 active:scale-95' 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                          )}
                        >
                          {amt} <span className="text-[8px] opacity-60 ml-0.5">Q</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={fetchQuestions} 
                      disabled={isLoading}
                      className="w-full h-16 rounded-[1.25rem] btn-orange shadow-premium active-bounce text-lg font-black italic tracking-tighter"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin mr-3" />
                          Generiere...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-3" />
                          Blatt erstellen
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {showPreview && questions.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <PDFDownloadLink
                  document={<ExercisePDFTemplate questions={questions} category={category === 'mixed' ? 'Gemischte Übungen' : selectedCategoryLabel} level={level} />}
                  fileName={`egaldeutsch_${category}_${level}.pdf`}
                >
                  {({ loading }) => (
                    <Button 
                      className="w-full h-16 rounded-[1.25rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/30 active-bounce text-lg border-b-4 border-emerald-700 transition-all"
                      disabled={loading}
                    >
                      <FileDown className="w-6 h-6 mr-3" />
                      {loading ? "Vorbereitung..." : "PDF Herunterladen"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </div>

          {/* Main: Preview */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 block leading-none mb-1">Live Vorschau</span>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">A4 Druckformat</span>
                </div>
              </div>
              {questions.length > 0 && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-500/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.1em]">Bereit zum Druck</span>
                 </div>
              )}
            </div>

            <div className="flex-1 min-h-[750px] bg-slate-100 rounded-[3.5rem] p-4 shadow-inner border-4 border-white relative group">
              <div className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-200/50">
                {showPreview && questions.length > 0 ? (
                  <div className="h-full relative">
                    <PDFViewer width="100%" height="100%" style={{ border: 'none' }} showToolbar={false}>
                      <ExercisePDFTemplate questions={questions} category={category === 'mixed' ? 'Gemischte Übungen' : selectedCategoryLabel} level={level} />
                    </PDFViewer>
                    {/* Visual Overlay for context */}
                    <div className="absolute top-4 right-4 pointer-events-none">
                       <div className="px-3 py-1 bg-slate-800/80 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest shadow-xl">Vorschau Modus</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-white to-slate-50/30">
                    <div className="relative mb-8 group-hover:scale-110 transition-transform duration-700">
                      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse" />
                      <div className="w-28 h-28 bg-white border border-slate-100 shadow-premium rounded-[2.5rem] flex items-center justify-center text-slate-200 relative z-10">
                        <FileDown className="w-12 h-12 text-slate-300" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight italic mb-3 leading-none">Deine Übungen warten!</h3>
                    <p className="text-slate-400 text-sm max-w-sm font-bold leading-relaxed">
                      Wähle Thema und Level, um ein individuelles Übungsblatt mit Lösungsschlüssel zu erstellen. Perfekt für das Offline-Lernen!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </AppShell>
  );
}
