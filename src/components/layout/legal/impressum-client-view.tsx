"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { BarChart3 } from "lucide-react";

export function ImpressumClientView() {
  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="w-full">
         <Section spacing="sm">
            <VisualPageHeader
               title="Impressum"
               subtitle="Legal Notice according to § 5 TMG"
               icon={<BarChart3 className="w-6 h-6" />}
            />
         </Section>

         <Section spacing="md">
            <div className="space-y-12">
               <div className="glass-card-premium p-8 rounded-[2.5rem] space-y-8 border border-white/50 shadow-premium">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 mb-3 italic">Angaben gemäß § 5 TMG</h2>
                    <p className="text-slate-600 leading-relaxed font-bold text-sm">
                      EgalDeutsch Learning Platform<br />
                      Steve Phan<br />
                      Dorfstraße 35<br />
                      13057 Berlin
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-800 mb-3 italic">Kontakt</h2>
                    <p className="text-slate-600 leading-relaxed font-bold text-sm">
                      E-Mail: 	egaldeutsch.com@gmail.com
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-800 mb-3 italic">Redaktionell verantwortlich</h2>
                    <p className="text-slate-600 leading-relaxed font-bold text-sm">
                      Steve Phan<br />
                      Dorfstraße 35<br />
                      13057 Berlin
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <h2 className="text-lg font-black text-slate-800 mb-3 italic">EU-Streitschlichtung</h2>
                    <p className="text-slate-500 leading-relaxed font-bold text-xs">
                      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                      <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-600 underline underline-offset-4 decoration-2 transition-colors ml-1">
                        https://ec.europa.eu/consumers/odr/
                      </a>.<br />
                      Unsere E-Mail-Adresse finden Sie oben im Impressum.
                    </p>
                  </div>
               </div>

               <footer className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] pt-8 border-t border-slate-100 italic">
                  Stand: {new Date().toLocaleDateString("de-DE")}
               </footer>
            </div>
         </Section>
      </div>
    </AppShell>
  );
}
