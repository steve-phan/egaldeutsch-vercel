"use client";

import { AppShell } from "@/components/layout/app-shell";

export function ImpressumClientView() {
  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="py-12 px-4 max-w-3xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter italic">Impressum</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Legal Notice according to § 5 TMG</p>
        </header>

        <section className="space-y-6">
          <div className="glass-card-premium p-8 rounded-[2rem] space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">Angaben gemäß § 5 TMG</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                EgalDeutsch Learning Platform<br />
                Steve Phan<br />
                Dorfstraße 35<br />
                13057 Berlin
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">Kontakt</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                E-Mail: 	egaldeutsch.com@gmail.com
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">Redaktionell verantwortlich</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Steve Phan<br />
                Dorfstraße 35<br />
                13057 Berlin
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">EU-Streitschlichtung</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-600 underline underline-offset-4 decoration-2 transition-colors ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>.<br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-8 border-t border-slate-100">
          Stand: {new Date().toLocaleDateString("de-DE")}
        </footer>
      </div>
    </AppShell>
  );
}
