"use client";

import { CheckCircle2, GraduationCap, Target, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function PurposeSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "What is EgalDeutsch?",
      subtitle: "Our Purpose & Mission",
      description: "EgalDeutsch is a dedicated language learning platform designed to simplify the complexity of German grammar. Our mission is to provide learners with high-quality, interactive tools to achieve fluency and professional success.",
      features: [
        { icon: <Zap className="w-5 h-5" />, title: "Interactive Quizzes", text: "Master grammar topics from A1 to B2 with real-time feedback." },
        { icon: <Target className="w-5 h-5" />, title: "Exam Prep", text: "Structured training for TELC, Goethe, and B2 Beruf." },
        { icon: <GraduationCap className="w-5 h-5" />, title: "CEFR Standard", text: "Curated modules following the European Framework." }
      ]
    },
    de: {
      title: "Was ist EgalDeutsch?",
      subtitle: "Unser Ziel & Mission",
      description: "EgalDeutsch ist eine spezialisierte Lernplattform, die darauf abzielt, die Komplexität der deutschen Grammatik zu vereinfachen. Wir bieten hochwertige, interaktive Werkzeuge für Ihren Erfolg.",
      features: [
        { icon: <Zap className="w-5 h-5" />, title: "Interaktive Quizze", text: "Meistere Grammatikthemen von A1 bis B2 mit Feedback." },
        { icon: <Target className="w-5 h-5" />, title: "Prüfungs-Vorbereitung", text: "Training für TELC-, Goethe- und B2 Beruf." },
        { icon: <GraduationCap className="w-5 h-5" />, title: "GER-Standard", text: "Module nach dem Gemeinsamen Europäischen Referenzrahmen." }
      ]
    },
    vi: {
      title: "EgalDeutsch là gì?",
      subtitle: "Mục tiêu & Sứ mệnh",
      description: "EgalDeutsch là nền tảng học tiếng Đức chuyên biệt giúp đơn giản hóa ngữ pháp phức tạp. Chúng tôi cung cấp công cụ tương tác để bạn đạt được sự lưu loát và thành công.",
      features: [
        { icon: <Zap className="w-5 h-5" />, title: "Trắc nghiệm", text: "Làm chủ ngữ pháp từ A1 đến B2 với phản hồi tức thì." },
        { icon: <Target className="w-5 h-5" />, title: "Luyện thi", text: "Đào tạo bài bản cho các kỳ thi TELC, Goethe và B2 Beruf." },
        { icon: <GraduationCap className="w-5 h-5" />, title: "Chuẩn CEFR", text: "Các chương trình học thiết kế theo chuẩn Châu Âu." }
      ]
    }
  };

  const current = content[language as keyof typeof content] || content.en;

  return (
    <div className="w-full glass-card-premium rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden border border-white/40 shadow-premium">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
           <div className="md:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                 <CheckCircle2 className="w-3 h-3" /> Application Purpose
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter italic">
                {current.title}
              </h2>
              <p className="text-base font-bold text-slate-500 leading-relaxed">
                {current.description}
              </p>
           </div>

           <div className="md:w-1/2 grid grid-cols-1 gap-4">
              {current.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-white/60 hover:bg-white/60 transition-all group">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">{feature.title}</h4>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{feature.text}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
