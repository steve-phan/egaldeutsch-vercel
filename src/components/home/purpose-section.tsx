"use client";

import { CheckCircle2, GraduationCap, Target, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function PurposeSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "What is EgalDeutsch?",
      subtitle: "Our Purpose & Mission",
      description: "EgalDeutsch is a dedicated language learning platform designed to simplify the complexity of German grammar. Our mission is to provide learners with high-quality, interactive tools to achieve fluency and professional success in German-speaking environments.",
      features: [
        { icon: <Zap className="w-5 h-5" />, title: "Interactive Quizzes", text: "Master grammar topics from A1 to B2 with real-time feedback." },
        { icon: <Target className="w-5 h-5" />, title: "Exam Preparation", text: "Structured training for TELC, Goethe, and B2 Beruf certifications." },
        { icon: <GraduationCap className="w-5 h-5" />, title: "Structured Learning", text: "Curated modules following the Common European Framework (CEFR)." }
      ]
    },
    de: {
      title: "Was ist EgalDeutsch?",
      subtitle: "Unser Ziel & Mission",
      description: "EgalDeutsch ist eine spezialisierte Lernplattform, die darauf abzielt, die Komplexität der deutschen Grammatik zu vereinfachen. Unsere Mission ist es, Lernenden hochwertige, interaktive Werkzeuge zur Verfügung zu stellen, um fließende Sprachkenntnisse und beruflichen Erfolg zu erzielen.",
      features: [
        { icon: <Zap className="w-5 h-5" />, title: "Interaktive Quizze", text: "Meistere Grammatikthemen von A1 bis B2 mit Echtzeit-Feedback." },
        { icon: <Target className="w-5 h-5" />, title: "Prüfungsvorbereitung", text: "Strukturiertes Training für TELC-, Goethe- und B2 Beruf-Zertifikate." },
        { icon: <GraduationCap className="w-5 h-5" />, title: "Strukturiertes Lernen", text: "Kuratierte Module nach dem Gemeinsamen Europäischen Referenzrahmen (GER)." }
      ]
    },
    vi: {
      title: "EgalDeutsch là gì?",
      subtitle: "Mục tiêu & Sứ mệnh",
      description: "EgalDeutsch là nền tảng học ngôn ngữ chuyên biệt giúp đơn giản hóa ngữ pháp tiếng Đức phức tạp. Sứ mệnh của chúng tôi là cung cấp cho người học các công cụ tương tác chất lượng cao để đạt được sự lưu loát và thành công chuyên nghiệp.",
      features: [
        { icon: <Zap className="w-5 h-5" />, title: "Trắc nghiệm tương tác", text: "Làm chủ ngữ pháp từ A1 đến B2 với phản hồi tức thì." },
        { icon: <Target className="w-5 h-5" />, title: "Luyện thi chuyên sâu", text: "Đào tạo bài bản cho các kỳ thi TELC, Goethe và B2 Beruf." },
        { icon: <GraduationCap className="w-5 h-5" />, title: "Lộ trình bài bản", text: "Các chương trình học được thiết kế theo chuẩn khung tham chiếu Châu Âu (CEFR)." }
      ]
    }
  };

  const current = content[language as keyof typeof content] || content.en;

  return (
    <section className="py-16 px-6 glass-card-premium rounded-[2.5rem] mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
           <CheckCircle2 className="w-3 h-3" /> Application Purpose
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter italic mb-4">
          {current.title}
        </h2>
        <p className="text-lg font-bold text-slate-500 mb-10 leading-relaxed">
          {current.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {current.features.map((feature, i) => (
            <div key={i} className="p-6 bg-white/50 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 italic">{feature.title}</h4>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
