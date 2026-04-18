"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useFeedback, FeedbackRecord } from "@/hooks/use-feedback";
import { MessageSquareHeart, ShieldAlert, Calendar, User, Mail, Star, RefreshCw, ChevronRight } from "lucide-react";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Card } from "@/components/shared/layout/card";
import { format } from "date-fns";

export default function AdminFeedbackPage() {
   const { fetchAllFeedback, loading, error } = useFeedback();
   const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);

   const loadFeedback = async () => {
      const data = await fetchAllFeedback();
      setFeedbacks(data);
   };

   useEffect(() => {
      loadFeedback();
   }, []);

   const getCategoryColor = (cat: string) => {
      switch (cat) {
         case "Bug Report": return "bg-rose-50 text-rose-500 border-rose-100";
         case "Feature Request": return "bg-amber-50 text-amber-500 border-amber-100";
         case "Praise": return "bg-emerald-50 text-emerald-500 border-emerald-100";
         default: return "bg-indigo-50 text-indigo-500 border-indigo-100";
      }
   };

   return (
      <AppShell showNav={true} maxWidth="2xl">
         <div className="space-y-12">
            <VisualPageHeader
               title="Voice of the People"
               subtitle="User feedback, bugs, and suggestions"
               icon={<MessageSquareHeart className="w-6 h-6" />}
               iconColor="bg-slate-800"
            >
               <button
                  onClick={loadFeedback}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary shadow-premium border border-white transition-all active:rotate-180 duration-500"
               >
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
               </button>
            </VisualPageHeader>

            {error && (
               <Card padding="md" glass={false} className="bg-rose-50 border-rose-100 text-rose-500">
                  <div className="flex items-center gap-3">
                     <ShieldAlert className="w-5 h-5" />
                     <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                  </div>
               </Card>
            )}

            <div className="grid grid-cols-1 gap-6">
               {loading && feedbacks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-white">
                     <RefreshCw className="w-10 h-10 animate-spin text-primary mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collecting voices...</p>
                  </div>
               ) : feedbacks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200">
                     <MessageSquareHeart className="w-12 h-12 text-slate-200 mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No feedback received yet</p>
                  </div>
               ) : (
                  feedbacks.map((item, idx) => (
                     <Card
                        key={item.id}
                        padding="none"
                        glow
                        radius="3xl"
                        className="overflow-hidden group animate-in slide-in-from-bottom-4 duration-500 fill-mode-both shadow-premium"
                     >
                        <div className="flex flex-col md:flex-row h-full">
                           {/* Context Side */}
                           <div className="p-8 md:w-80 bg-slate-50 border-r border-slate-100 flex flex-col justify-between space-y-6">
                              <div className="space-y-4">
                                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getCategoryColor(item.category)}`}>
                                    {item.category}
                                 </div>

                                 <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                       <Star
                                          key={s}
                                          className={`w-3.5 h-3.5 ${s <= item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                                       />
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 {item.user_name ? (
                                    <div className="flex items-center gap-2 text-slate-600">
                                       <User className="w-3.5 h-3.5" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">{item.user_name}</span>
                                    </div>
                                 ) : item.guest_email ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                       <Mail className="w-3.5 h-3.5" />
                                       <span className="text-[10px] font-black tracking-widest lowercase truncate max-w-[150px]">{item.guest_email}</span>
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2 text-slate-400">
                                       <User className="w-3.5 h-3.5" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">Guest Learner</span>
                                    </div>
                                 )}

                                 <div className="flex items-center gap-2 text-slate-300">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase">{format(new Date(item.created_at), 'MMM dd, HH:mm')}</span>
                                 </div>
                              </div>
                           </div>

                           {/* Message Side */}
                           <div className="p-8 flex-1 flex flex-col justify-between bg-white relative">
                              <p className="text-sm font-bold text-slate-600 italic leading-relaxed">
                                 "{item.message}"
                              </p>

                              <div className="mt-6 flex items-center justify-between">
                                 <div className="flex gap-4">
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black text-slate-300 uppercase">IP Address</span>
                                       <span className="text-[10px] font-mono text-slate-400">{item.ip_address}</span>
                                    </div>
                                 </div>

                                 <button className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest group">
                                    Archive <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </Card>
                  ))
               )}
            </div>
         </div>
      </AppShell>
   );
}
