"use client";

import { CheckCircle2, Target, Zap, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";

import { Brand } from "@/components/shared/brand";

export function PurposeSection() {
  const { language } = useLanguage();

  const getTitle = () => {
    switch (language) {
      case "de": return <>Warum <Brand as="span" inline />?</>;
      case "vi": return <>Tại sao chọn <Brand as="span" inline />?</>;
      default: return <>Why <Brand as="span" inline />?</>;
    }
  };

  const getSubtext = () => {
    switch (language) {
      case "de": return "Die ultimative Plattform, um die deutsche Grammatik zu beherrschen.";
      case "vi": return "Nền tảng tối ưu để chinh phục ngữ pháp tiếng Đức.";
      default: return "The ultimate platform to master German grammar.";
    }
  };

  const features = [
    {
      icon: <Target className="w-5 h-5 text-indigo-500" />,
      title: language === "de" ? "Zielgerichtet" : language === "vi" ? "Mục tiêu rõ ràng" : "Targeted",
      text: language === "de" ? "Übungen für jedes GER-Niveau (A1-C1)." : language === "vi" ? "Bài tập cho mọi trình độ CEFR." : "Exercises for every CEFR level."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: language === "de" ? "Effizient" : language === "vi" ? "Hiệu quả" : "Efficient",
      text: language === "de" ? "Lerne schneller mit sofortigem Feedback." : language === "vi" ? "Học nhanh hơn với phản hồi tức thì." : "Learn faster with instant feedback."
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      title: language === "de" ? "Sicher" : language === "vi" ? "Tin cậy" : "Reliable",
      text: language === "de" ? "Von Sprachperten kuratierte Inhalte." : language === "vi" ? "Nội dung được kiểm duyệt bởi chuyên gia." : "Content curated by language experts."
    }
  ];

  return (
    <Section spacing="md">
      <Card padding="none" className="w-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
        
        <div className="relative z-10 p-8 md:p-14 lg:p-16">
          <div className="max-w-3xl mb-12 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Mission Statement
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-slate-800 italic tracking-tighter leading-[1.1]">
                {getTitle()}
             </h2>
             <p className="text-base md:text-lg font-bold text-slate-400">
                {getSubtext()}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="space-y-4 group/item">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-premium border border-slate-50 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800 italic">{feature.title}</h3>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-16 pt-10 border-t border-slate-100/50 flex flex-wrap gap-8">
             <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">100+ Grammar Modules</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI-Powered Feedback</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Free for everyone</span>
             </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
