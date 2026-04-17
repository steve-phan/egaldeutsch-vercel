"use client";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { Trophy, Zap, MessageCircle, Star, Clock, ChevronRight } from "lucide-react";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { PremiumCard } from "@/components/shared/premium-card";

export default function NotificationsPage() {
  const notifications = [
    {
      id: "1",
      title: "Mission Accomplished!",
      description: "You've successfully mastered the 'Definite Articles' mission with 100% precision.",
      type: "achievement",
      time: "2h ago",
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-50"
    },
    {
      id: "2",
      title: "Daily Streak Saved",
      description: "Great job! You've kept your 5-day learning streak alive. Keep it up!",
      type: "streak",
      time: "5h ago",
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      color: "bg-orange-50"
    },
    {
      id: "3",
      title: "New Module Available",
      description: "The 'Dative Case' module is now ready for your level (A2). Check it out!",
      type: "system",
      time: "1d ago",
      icon: <Star className="w-5 h-5 text-primary" />,
      color: "bg-primary/10"
    },
    {
      id: "4",
      title: "Community Update",
      description: "Student 'Roden' just completed the B1 Grammar Challenge. Wish them luck!",
      type: "social",
      time: "2d ago",
      icon: <MessageCircle className="w-5 h-5 text-indigo-500" />,
      color: "bg-indigo-50"
    }
  ];

  return (
    <AppShell showNav={true} maxWidth="md">
      <DashboardHeader />

      <section className="w-full pt-10 space-y-10">
         <VisualPageHeader
            title="Activity Feed"
            subtitle="Your Mastery Timeline"
            icon={<Clock className="w-6 h-6" />}
         />

         <div className="space-y-4">
            {notifications.map((notif, idx) => (
               <PremiumCard 
                 key={notif.id}
                 delay={idx * 100}
                 padding="md"
                 className="flex items-center gap-5 translate-x-0"
               >
                  <div className={`w-14 h-14 ${notif.color} rounded-2xl flex items-center justify-center shrink-0`}>
                     {notif.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-black text-slate-800 tracking-tight">{notif.title}</h3>
                        <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase shrink-0">
                           <Clock className="w-2.5 h-2.5" /> {notif.time}
                        </div>
                     </div>
                     <p className="text-xs font-bold text-slate-400 leading-tight">
                        {notif.description}
                     </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                     <ChevronRight className="w-4 h-4" />
                  </div>
               </PremiumCard>
            ))}
         </div>

         <div className="mt-12 p-8 glass-card-premium rounded-[3rem] bg-slate-50/50 border-dashed border-slate-200 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">That's everything for now</p>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Check back later for more updates</p>
         </div>
      </section>
    </AppShell>
  );
}
