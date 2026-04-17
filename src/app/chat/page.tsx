"use client";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { MessageCircle, Users, Zap, Award, Send, SlidersHorizontal, UserPlus } from "lucide-react";
import Image from "next/image";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { PremiumCard } from "@/components/shared/premium-card";

export default function SocialPage() {
  const achievements = [
    { id: 1, user: "Elena", action: "reached level", value: "Master (B2)", time: "Just now", xp: "+500 XP" },
    { id: 2, user: "Markus", action: "finished", value: "The Genitive Mission", time: "3m ago", xp: "+250 XP" },
    { id: 3, user: "Duc Anh", action: "started a", value: "7-Day Streak", time: "12m ago", xp: "+100 XP" },
  ];

  return (
    <AppShell showNav={true} maxWidth="lg">
      <DashboardHeader />

      <section className="w-full pt-10 space-y-12">
         {/* Community Layout Header */}
         <VisualPageHeader
            title="Social Hub"
            subtitle="Learning German, together."
            icon={<Users className="w-6 h-6" />}
         >
            <div className="flex items-center gap-3">
               <div className="glass-card-premium px-4 py-2 rounded-xl flex items-center gap-3 border border-white">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative">
                           <Image src={`/mascot.png`} alt="User" fill className="object-cover opacity-50 grayscale" />
                        </div>
                     ))}
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">1,248 Online</p>
               </div>
               <button className="w-10 h-10 bg-white shadow-premium rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90 border border-slate-50">
                  <UserPlus className="w-5 h-5" />
               </button>
            </div>
         </VisualPageHeader>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Achievement Ticker */}
            <div className="lg:col-span-1 space-y-6">
               <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Activity</h2>
               </div>
               
               <div className="space-y-4">
                  {achievements.map((item, idx) => (
                     <PremiumCard 
                        key={item.id} 
                        delay={idx * 150}
                        padding="md"
                        className="flex flex-col gap-3 group border border-white/50"
                     >
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{item.user}</span>
                           <span className="text-[8px] font-bold text-slate-300 uppercase">{item.time}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 italic">
                           {item.action} <span className="text-primary not-italic">{item.value}</span>
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                           <Zap className="w-3 h-3 fill-emerald-500" /> {item.xp}
                        </div>
                     </PremiumCard>
                  ))}
               </div>
            </div>

            {/* Global Chat Preview */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                     <MessageCircle className="w-5 h-5 text-indigo-500" />
                     <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Lounge</h2>
                  </div>
                  <SlidersHorizontal className="w-4 h-4 text-slate-300 cursor-pointer hover:text-primary transition-colors" />
               </div>

               <PremiumCard padding="none" className="h-[500px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-1000">
                  {/* Messages Placeholder */}
                  <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-white/10">
                     <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 grayscale">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                           <Users className="w-10 h-10" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">The Lounge is quiet</p>
                           <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Start a conversation below</p>
                        </div>
                     </div>
                  </div>

                  {/* Input Dock */}
                  <div className="p-6 bg-slate-50/50 backdrop-blur-md border-t border-white">
                     <div className="relative">
                        <input 
                           type="text"
                           placeholder="Speak German here..."
                           className="w-full h-14 pl-6 pr-16 rounded-2xl bg-white border-white shadow-premium outline-none transition-all font-bold text-sm"
                        />
                        <button className="absolute right-2 top-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                           <Send className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </PremiumCard>
            </div>
         </div>

      </section>
    </AppShell>
  );
}
