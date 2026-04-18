"use client";

import { AppShell } from "@/components/layout/app-shell";

export default function DatenschutzPage() {
  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="py-12 px-4 max-w-3xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter italic">Datenschutz</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Privacy Policy according to GDPR (DSGVO)</p>
        </header>

        <section className="space-y-12">
          {/* Section 1: Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 italic">1. Datenschutz auf einen Blick</h2>
            <div className="glass-card-premium p-8 rounded-[2rem] space-y-6 text-slate-600 leading-relaxed font-medium">
              <h3 className="text-lg font-black text-slate-800 italic">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>
              
              <h3 className="text-lg font-black text-slate-800 italic">Datenerfassung auf dieser Website</h3>
              <p>
                <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber:<br />
                Steve Phan, Dorfstraße 35, 13057 Berlin.<br />
                E-Mail: 	egaldeutsch.com@gmail.com
              </p>
            </div>
          </div>

          {/* Section 2: Hosting */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 italic">2. Hosting</h2>
            <div className="glass-card-premium p-8 rounded-[2rem] space-y-6 text-slate-600 leading-relaxed font-medium">
              <p>
                Wir hosten unsere Website bei <strong>Vercel</strong>. Anbieter ist die Vercel Inc., 440 N Barranca Ave #4133 Covina, CA 91723, USA.
              </p>
              <p>
                Vercel ist eine Plattform zum Hosting von Websites. Wenn Sie unsere Website besuchen, erfasst Vercel verschiedene Logfiles inklusive Ihrer IP-Adressen. Details entnehmen Sie der Datenschutzerklärung von Vercel: 
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">vercel.com/legal/privacy-policy</a>.
              </p>
              <p>
                Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
              </p>
            </div>
          </div>

          {/* Section 3: Core Functions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 italic">3. Registrierung und Authentifizierung</h2>
            <div className="glass-card-premium p-8 rounded-[2rem] space-y-6 text-slate-600 leading-relaxed font-medium">
              <p>
                Unsere Website nutzt <strong>Next-Auth</strong> zur Verwaltung von Benutzersitzungen und <strong>Google OAuth</strong> zur Authentifizierung.
              </p>
              <h3 className="text-lg font-black text-slate-800 italic">Google Login</h3>
              <p>
                Wenn Sie sich via Google einloggen, erhalten wir von Google eine eindeutige ID, Ihre E-Mail-Adresse und Ihren Namen. Diese Daten werden in unserer Datenbank (MongoDB) gespeichert, um Ihr Nutzerprofil zu verwalten.
              </p>
              <h3 className="text-lg font-black text-slate-800 italic">Next-Auth Cookies</h3>
              <p>
                Next-Auth verwendet technisch notwendige Cookies, um Ihren Login-Status zu speichern. Ohne diese Cookies ist ein Login nicht möglich.
              </p>
            </div>
          </div>

          {/* Section 4: Communication */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 italic">4. E-Mail-Versand</h2>
            <div className="glass-card-premium p-8 rounded-[2rem] space-y-6 text-slate-600 leading-relaxed font-medium">
              <p>
                Für den Versand von Transaktions-E-Mails (z.B. Passwort-Reset, Willkommens-E-Mails) nutzen wir <strong>Brevo</strong> (ehemals Sendinblue). Anbieter ist die Sendinblue GmbH, Köpenicker Straße 126, 10179 Berlin, Deutschland.
              </p>
              <p>
                Dabei werden Ihre E-Mail-Adresse und Ihr Name an Brevo übertragen. Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              </p>
            </div>
          </div>

          {/* Section 5: Your Rights */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 italic">5. Ihre Rechte</h2>
            <div className="glass-card-premium p-8 rounded-[2rem] space-y-6 text-slate-600 leading-relaxed font-medium">
              <p>
                Sie haben jederzeit das Recht:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Auskunft über Ihre gespeicherten Daten zu erhalten (Art. 15 DSGVO).</li>
                <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO).</li>
                <li>Die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO).</li>
                <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO).</li>
              </ul>
              <p className="mt-4">
                Wenden Sie sich hierzu bitte an die im Impressum angegebene E-Mail-Adresse.
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
