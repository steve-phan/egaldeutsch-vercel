"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Shield } from "lucide-react";

export function DatenschutzClientView() {
   return (
      <AppShell showNav={false} maxWidth="lg">
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
                           Steve Phan, Dorfstraße 35P, 13057 Berlin.<br />
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
                        
                        <h3 className="text-lg font-black text-slate-800 italic">Google Login & Google-Nutzerdaten</h3>
                        <p className="text-sm">
                           Wenn Sie sich über Google bei EgalDeutsch anmelden, fordern wir Zugriff auf Ihre Google-Basisdaten an (Standard-Scopes: <em>openid, email, profile</em>).
                        </p>
                        
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                           <li>
                              <strong>Erhobene Daten:</strong> Wir erhalten von Google Ihre E-Mail-Adresse, Ihren vollständigen Namen und (falls vorhanden) den Link zu Ihrem Profilbild.
                           </li>
                           <li>
                              <strong>Verwendungszweck:</strong> Diese Daten werden ausschließlich dazu verwendet, Ihr Benutzerkonto zu erstellen, Sie bei künftigen Logins zu identifizieren und Ihre Erfahrung innerhalb der App zu personalisieren (z. B. Anzeige Ihres Namens im Dashboard).
                           </li>
                           <li>
                              <strong>Speicherung & Sicherheit:</strong> Diese Daten werden sicher in unserer Datenbank (MongoDB) gespeichert. Wir speichern keine Google-Passwörter oder Zugriffstoken dauerhaft.
                           </li>
                           <li>
                              <strong>Keine Weitergabe:</strong> Wir geben Ihre Google-Nutzerdaten nicht an Dritte weiter. Die Daten werden nicht für Werbezwecke verkauft oder verwendet.
                           </li>
                           <li>
                              <strong>Kein KI-Training:</strong> Ihre Google-Nutzerdaten werden nicht zum Trainieren von KI-Modellen oder Machine-Learning-Algorithmen verwendet.
                           </li>
                        </ul>
                        
                        <p className="text-sm">
                           Sie können den Zugriff von EgalDeutsch auf Ihr Google-Konto jederzeit in den Sicherheitseinstellungen Ihres Google-Kontos widerrufen.
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
