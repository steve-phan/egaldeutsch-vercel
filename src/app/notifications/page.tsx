"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Trophy, Zap, MessageCircle, Star, Clock, ChevronRight, BellOff } from "lucide-react";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Card } from "@/components/shared/layout/card";
import { useNotifications, Notification } from "@/hooks/use-notifications";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/contexts/language-context";
import { enUS, vi as viLocale } from "date-fns/locale";

export default function NotificationsPage() {
   const { t, language } = useLanguage();
   const { status } = useSession();
   const router = useRouter();
   const { notifications, isLoading, markAsRead } = useNotifications();

   const dateLocale = language === "vi" ? viLocale : language === "de" ? de : enUS;

   // Route Protection: Redirect guests to login
   useEffect(() => {
      if (status === "unauthenticated") {
         router.push("/login");
      }
   }, [status, router]);

   // Mark all as read when user views this page
   useEffect(() => {
      if (notifications.length > 0 && notifications.some(n => !n.is_read)) {
         markAsRead();
      }
   }, [notifications, markAsRead]);

   if (status === "loading" || status === "unauthenticated") {
      return (
         <AppShell showNav={true} maxWidth="md">
            <section className="w-full pt-10 space-y-10 pb-20 px-4 md:px-0">
               <div className="space-y-4">
                  <Skeleton className="h-10 w-48 bg-slate-100 rounded-xl" />
                  <Skeleton className="h-24 w-full bg-slate-50 rounded-2xl" />
                  <Skeleton className="h-24 w-full bg-slate-50 rounded-2xl" />
                  <Skeleton className="h-24 w-full bg-slate-50 rounded-2xl" />
               </div>
            </section>
         </AppShell>
      );
   }

   const getNotifStyles = (type: Notification["type"]) => {
      switch (type) {
         case "achievement":
            return { icon: <Trophy className="w-5 h-5 text-amber-500" />, color: "bg-amber-50" };
         case "streak":
            return { icon: <Zap className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" };
         case "system":
            return { icon: <Star className="w-5 h-5 text-primary" />, color: "bg-primary/10" };
         case "social":
            return { icon: <MessageCircle className="w-5 h-5 text-indigo-500" />, color: "bg-indigo-50" };
         default:
            return { icon: <Star className="w-5 h-5 text-slate-500" />, color: "bg-slate-50" };
      }
   };

   return (
      <AppShell showNav={true} maxWidth="md">
         <section className="w-full pt-10 space-y-10 pb-20">
            <VisualPageHeader
               title={t("notifications.title")}
               subtitle={t("notifications.subtitle")}
               icon={<Clock className="w-6 h-6" />}
            />

            <div className="space-y-4">
               {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                     <Skeleton key={i} className="h-24 animate-pulse bg-slate-50/50" />
                  ))
               ) : notifications.length > 0 ? (
                  notifications.map((notif) => {
                     const { icon, color } = getNotifStyles(notif.type);
                     return (
                        <Link key={notif.id} href={notif.link || "#"} className="block group">
                           <Card
                              padding="md"
                              radius="2xl"
                              hover
                              className={`flex items-center gap-5 transition-all ${!notif.is_read ? 'border-primary/20 bg-primary/[0.02]' : 'opacity-80'}`}
                           >
                              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                 {icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-black text-slate-800 tracking-tight">{notif.title}</h3>
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300 uppercase shrink-0">
                                       <Clock className="w-2.5 h-2.5" /> {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: dateLocale })}
                                    </div>
                                 </div>
                                 <p className="text-xs font-bold text-slate-400 leading-tight">
                                    {notif.description}
                                 </p>
                              </div>

                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:text-primary transition-colors">
                                 <ChevronRight className="w-4 h-4" />
                              </div>
                           </Card>
                        </Link>
                     );
                  })
               ) : (
                  <Card padding="lg" glass={false} className="bg-slate-50/50 border-dashed border-slate-200 text-center py-16">
                     <BellOff className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("notifications.no_activity")}</p>
                     <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">{t("notifications.no_activity_desc")}</p>
                  </Card>
               )}
            </div>

            {notifications.length > 0 && (
               <Card padding="lg" glass={false} className="mt-12 bg-slate-50/50 border-dashed border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("notifications.footer_title")}</p>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">{t("notifications.footer_desc")}</p>
               </Card>
            )}
         </section>
      </AppShell>
   );
}
