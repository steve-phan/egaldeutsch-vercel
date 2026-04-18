"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Shield } from "lucide-react";

export function DatenschutzClientView() {
  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="w-full">
         <Section spacing="sm">
            <VisualPageHeader
               title="Datenschutz"
               subtitle="Privacy Policy according to GDPR (DSGVO)"
               icon={<Shield className="w-6 h-6" />}
            />
         </Section>

         <Section spacing="md">
            <div className="space-y-12">
               {/* Section 1: Overview */}
               <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-800 italic">1. Datenschutz auf einen Blick</h2>
                  <Card padding="lg" radius="3xl" className="space-y-6 text-slate-600 leading-relaxed font-bold">
                     <h3 className="text-lg font-black text-slate-800 italic">Allgemeine Hinweise</h3>
                     <p className="text-sm">
                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                     </p>

                     <h3 className="text-lg font-black text-slate-800 italic">Datenerfassung auf dieser Website</h3>
                     <p className="text-sm">
                        <strong>Wer ist verantwortlich für die Datenerfassung?</strong><br />
                        Steve Phan, Dorfstraße 35, 13057 Berlin.<br />
                        E-Mail: 	egaldeutsch.com@gmail.com
                     </p>
                  </Card>
               </div>

               {/* Section 2: Hosting */}
               <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-800 italic">2. Hosting</h2>
                  <Card padding="lg" radius="3xl" className="space-y-6 text-slate-600 leading-relaxed font-bold">
                     <p className="text-sm">
                        Wir hosten unsere Website bei <strong>Vercel</strong>. Anbieter ist die Vercel Inc., 440 N Barranca Ave #4133 Covina, CA 91723, USA.
                     </p>
                     <p className="text-sm">
                        Vercel erfasst Logfiles inklusive Ihrer IP-Adressen. Details:
                        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-600 underline underline-offset-4 decoration-2 transition-colors ml-1">vercel.com/legal/privacy-policy</a>.
                     </p>
                  </Card>
               </div>

               {/* Section 3: Core Functions */}
               <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-800 italic">3. Registrierung und Authentifizierung</h2>
                  <Card padding="lg" radius="3xl" className="space-y-6 text-slate-600 leading-relaxed font-bold">
                     <p className="text-sm">
                        Unsere Website nutzt <strong>Next-Auth</strong> zur Verwaltung von Benutzersitzungen und <strong>Google OAuth</strong> zur Authentifizierung.
                     </p>
                     <h3 className="text-lg font-black text-slate-800 italic">Google Login</h3>
                     <p className="text-sm">
                        Beim Login erhalten wir von Google eine ID, Ihre E-Mail-Adresse und Ihren Namen. Diese Daten werden in unserer MongoDB gespeichert.
                     </p>
                  </Card>
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
