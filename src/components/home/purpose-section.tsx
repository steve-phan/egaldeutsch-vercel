"use client";

import { CheckCircle2, Target, Zap, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Card } from "@/components/shared/layout/card";
import { Section } from "@/components/shared/layout/section";

import { Brand } from "@/components/shared/brand";
import React from "react";

export function PurposeSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Target className="w-5 h-5 text-primary" />,
      title: t("home.purpose.feature_targeted"),
      text: t("home.purpose.feature_targeted_text")
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: t("home.purpose.feature_efficient"),
      text: t("home.purpose.feature_efficient_text")
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: t("home.purpose.feature_reliable"),
      text: t("home.purpose.feature_reliable_text")
    }
  ];

  return (
    <Section spacing="md">
      <Card padding="none" className="w-full relative overflow-hidden group border-slate-100/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-[80px]" />

        <div className="relative z-10 p-8 md:p-14 lg:p-16">
          <div className="max-w-3xl mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-[10px] font-black text-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> {t("home.purpose.badge")}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 italic tracking-tighter leading-[1.1]">
              {t("home.purpose.title").split("EgalDeutsch").map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && <Brand as="span" inline />}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-base md:text-lg font-bold text-slate-400">
              {t("home.purpose.subtitle")}
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
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("home.purpose.stat_questions")}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("home.purpose.stat_feedback")}</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("home.purpose.stat_free")}</span>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
