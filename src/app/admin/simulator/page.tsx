"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DesignSimulator } from "@/components/admin/design-simulator";
import { Section } from "@/components/shared/layout/section";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SimulatorPage() {
  return (
    <AppShell showNav={false} maxWidth="brand">
      <Section spacing="md">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                <ArrowLeft className="w-3 h-3" /> Dashboard
              </Link>
              <h1 className="text-4xl md:text-6xl font-black italic text-slate-900 tracking-tighter leading-none">
                Dòng Chảy <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Hòa Khí</span>
              </h1>
              <p className="text-sm md:text-lg font-bold text-slate-400 max-w-xl">
                Phòng thí nghiệm tối ưu hóa trải nghiệm di động và cân bằng năng lượng Âm Dương cho EgalDeutsch.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-premium border border-slate-100">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                  <p className="text-xs font-black text-slate-800">Cân bằng tối ưu</p>
               </div>
            </div>
          </div>

          {/* Simulator Component */}
          <DesignSimulator />

          {/* Educational Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100 italic">
             <div className="space-y-2">
                <h4 className="font-black text-slate-800">Hành Kim (Metal)</h4>
                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                   Khoảng trắng (Spacing) rộng rãi giúp dòng khí "Kim" (Sự rõ ràng) sinh sôi, hỗ trợ cực tốt cho hành Thủy của Nhâm Tuất.
                </p>
             </div>
             <div className="space-y-2">
                <h4 className="font-black text-slate-800">Hành Mộc (Wood)</h4>
                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                   Kích thước chữ lớn và màu Emerald Green kích hoạt năng lượng "Mộc", mang lại sự sinh trưởng và phát triển kiến thức.
                </p>
             </div>
             <div className="space-y-2">
                <h4 className="font-black text-slate-800">Sát Khí Kỹ Thuật (Sát Khí)</h4>
                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                   Sự tắc nghẽn hình ảnh (Text quá nhỏ, Nút quá sát) tạo ra sát khí, làm người dùng mệt mỏi và rời bỏ trang web.
                </p>
             </div>
          </div>
        </div>
      </Section>
    </AppShell>
  );
}
