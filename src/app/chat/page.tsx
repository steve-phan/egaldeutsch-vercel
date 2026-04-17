"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import Image from "next/image";

export default function LessonsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pb-32">
       <DashboardHeader />
       <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative w-64 h-64 mb-10 animate-float opacity-50 grayscale">
             <Image src="/mascot.png" alt="Coming Soon" fill className="object-contain" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Lessons Coming Soon</h1>
          <p className="text-slate-500 font-bold max-w-md">We are currently curating the best German grammar lessons for you. Stay tuned!</p>
       </section>
       <BottomNav />
    </main>
  );
}
