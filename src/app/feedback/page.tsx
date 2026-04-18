"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { HeartHandshake, Bug, Lightbulb, PartyPopper, MessageSquare, Send, CheckCircle2, Star } from "lucide-react";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { PremiumCard } from "@/components/shared/premium-card";
import { useFeedback, FeedbackSubmission } from "@/hooks/use-feedback";
import { useSession } from "next-auth/react";

const CATEGORIES = [
   { id: "Bug Report", icon: <Bug className="w-5 h-5" />, color: "text-rose-500", bg: "bg-rose-50" },
   { id: "Feature Request", icon: <Lightbulb className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-50" },
   { id: "Praise", icon: <PartyPopper className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-50" },
   { id: "Other", icon: <MessageSquare className="w-5 h-5" />, color: "text-indigo-500", bg: "bg-indigo-50" },
];

export default function FeedbackPage() {
   const { data: session } = useSession();
   const { submitFeedback, loading, success, error, setSuccess } = useFeedback();

   const [formData, setFormData] = useState<FeedbackSubmission>({
      category: "Praise",
      message: "",
      rating: 5,
      hp_website: "", // Honeypot
      guest_email: ""
   });

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.message.trim() || formData.message.length < 5) return;
      await submitFeedback(formData);
   };

   if (success) {
      return (
         <AppShell showNav={true} maxWidth="lg">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-700">
               <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-premium border border-white">
                  <CheckCircle2 className="w-12 h-12" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">Vielen Dank!</h2>
                  <p className="text-slate-400 font-bold max-w-sm">
                     Your feedback helps us make EgalDeutsch better for everyone. We have successfully received your message.
                  </p>
               </div>
               <button
                  onClick={() => {
                     setSuccess(false);
                     setFormData({ ...formData, message: "", rating: 5 });
                  }}
                  className="h-12 px-8 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all shadow-premium"
               >
                  Send Another
               </button>
            </div>
         </AppShell>
      );
   }

   return (
      <AppShell showNav={true} maxWidth="lg">

         <section className="w-full pt-10 space-y-12">
            <VisualPageHeader
               title="Feedback Hub"
               subtitle="Help us curate the perfect learning experience"
               icon={<HeartHandshake className="w-6 h-6" />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
               {/* Left Column: Context */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black text-slate-800 italic tracking-tighter">Your voice matters.</h3>
                     <p className="text-sm font-bold text-slate-400 leading-relaxed">
                        EgalDeutsch is built for you. Whether it's a bug, a feature idea, or just some love, we read every single message.
                     </p>
                  </div>

                  <div className="space-y-4">
                     {CATEGORIES.map((cat, idx) => (
                        <div key={cat.id} className="flex items-center gap-4 group">
                           <div className={`w-10 h-10 ${cat.bg} ${cat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                              {cat.icon}
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{cat.id}</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase leading-none">Category</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <PremiumCard padding="md" className="bg-primary/5 border-primary/10">
                     <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-primary fill-primary/20 shrink-0" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
                           Earn 100 XP for your first feedback submission!
                        </p>
                     </div>
                  </PremiumCard>
               </div>

               {/* Right Column: Form */}
               <div className="lg:col-span-3">
                  <PremiumCard padding="lg" className="space-y-8">
                     <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Honeypot Field */}
                        <input
                           type="text"
                           name="hp_website"
                           value={formData.hp_website}
                           onChange={e => setFormData({ ...formData, hp_website: e.target.value })}
                           style={{ display: 'none' }}
                           autoComplete="off"
                        />

                        {/* Category Toggle */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Category</label>
                           <div className="grid grid-cols-2 gap-3">
                              {CATEGORIES.map(cat => (
                                 <button
                                    type="button"
                                    key={cat.id}
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={`h-12 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border-2
                                    ${formData.category === cat.id
                                          ? "bg-slate-800 text-white border-slate-800 scale-[1.02] shadow-lg"
                                          : "bg-white text-slate-400 border-slate-50 hover:border-slate-100"}
                                 `}
                                 >
                                    <span className={formData.category === cat.id ? "text-white" : cat.color}>{cat.icon}</span>
                                    {cat.id.split(' ')[0]}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How are we doing?</label>
                           <div className="flex items-center gap-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <button
                                    type="button"
                                    key={star}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`transition-all ${formData.rating >= star ? "scale-110" : "opacity-30 grayscale"}`}
                                 >
                                    <Star
                                       className={`w-8 h-8 ${formData.rating >= star ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                                    />
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* User Email (for guests) */}
                        {!session && (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address (Optional)</label>
                              <input
                                 type="email"
                                 placeholder="Where can we reach you?"
                                 value={formData.guest_email}
                                 onChange={e => setFormData({ ...formData, guest_email: e.target.value })}
                                 className="w-full h-12 px-6 rounded-2xl bg-slate-50/50 border-slate-100 shadow-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                              />
                           </div>
                        )}

                        {/* Message */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Message</label>
                           <textarea
                              required
                              minLength={5}
                              placeholder="What's on your mind?"
                              value={formData.message}
                              onChange={e => setFormData({ ...formData, message: e.target.value })}
                              className="w-full h-40 p-6 rounded-[2rem] bg-slate-50/50 border-slate-100 shadow-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm resize-none"
                           />
                           <div className="flex justify-end">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${formData.message.length < 5 ? 'text-rose-400' : 'text-slate-300'}`}>
                                 {formData.message.length} Characters
                              </span>
                           </div>
                        </div>

                        {error && (
                           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-shake">
                              {error}
                           </p>
                        )}

                        <button
                           type="submit"
                           disabled={loading || formData.message.length < 5}
                           className="btn-orange w-full h-14 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                           {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           ) : (
                              <>
                                 Send Feedback <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </>
                           )}
                        </button>
                     </form>
                  </PremiumCard>
               </div>
            </div>
         </section>
      </AppShell>
   );
}
