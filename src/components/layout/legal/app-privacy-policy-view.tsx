"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Section } from "@/components/shared/layout/section";
import { Card } from "@/components/shared/layout/card";
import { VisualPageHeader } from "@/components/shared/visual-page-header";
import { Shield, Globe, Mail, Trash2, Smartphone, Lock, UserCheck, HelpCircle, History, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Language = "en" | "de";

export function AppPrivacyPolicyClientView() {
  const [lang, setLang] = useState<Language>("de");

  return (
    <AppShell showNav={false} maxWidth="lg">
      <div className="w-full">
        <Section spacing="sm">
          <VisualPageHeader
            title={lang === "en" ? "App Privacy Policy" : "App-Datenschutz"}
            subtitle={lang === "en" ? "Complete privacy protection for the EgalDeutsch mobile application" : "Vollständige Datenschutzerklärung für die EgalDeutsch Mobile-App"}
            icon={<Shield className="w-6 h-6 text-primary" />}
          />
        </Section>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setLang("de")}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                lang === "de" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Globe className="w-4 h-4" />
              Deutsch
            </button>
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                lang === "en" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Globe className="w-4 h-4" />
              English
            </button>
          </div>
        </div>

        <Section spacing="md">
          <div className="space-y-10">
            {lang === "en" ? (
              <EnglishPolicy />
            ) : (
              <GermanPolicy />
            )}

            <footer className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] pt-8 border-t border-slate-100 italic flex justify-between items-center">
              <span>{lang === "en" ? "Last Updated" : "Stand"}: 28.04.2026</span>
              <span>EgalDeutsch App v1.0</span>
            </footer>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function SectionTitle({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <h2 className="text-xl font-black text-slate-800 italic flex items-center gap-3 mb-4">
      <Icon className="w-5 h-5 text-primary" />
      {title}
    </h2>
  );
}

function EnglishPolicy() {
  return (
    <div className="space-y-12">
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed font-bold">
        <p>
          EgalDeutsch ("we," "our," or "us") operates the EgalDeutsch mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>
      </div>

      <div className="space-y-6">
        <SectionTitle title="1. Information Collection & Use" icon={Smartphone} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold">
          <div className="space-y-3">
            <h3 className="text-slate-800 font-black">a. Personal Data</h3>
            <p className="text-sm">
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Profile picture (via Google)</li>
              <li>Language preferences</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-slate-800 font-black">b. Usage & Log Data</h3>
            <p className="text-sm">
              We may also collect information that your mobile device sends whenever you visit our Service or when you access the Service by or through a mobile device. This may include your IP address, device type, unique device identifiers, and other diagnostic data.
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="2. Permissions & Audio Data" icon={Lock} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold">
          <p className="text-sm">
            To provide the core language coaching features, we request **Microphone (RECORD_AUDIO)** permission. 
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Audio is processed using **Google ML Kit** for real-time pronunciation feedback.</li>
            <li>We do not store audio recordings permanently on our servers unless specifically required for a requested support case.</li>
          </ul>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="3. Retention of Data" icon={History} />
        <Card padding="lg" radius="3xl" className="text-slate-600 leading-relaxed font-bold text-sm">
          We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="4. Service Providers" icon={Share2} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold text-sm">
          <p>We may employ third-party companies and individuals to facilitate our Service:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Google Cloud Platform:** Hosting and backend infrastructure.</li>
            <li>**Google ML Kit:** On-device machine learning for speech recognition.</li>
            <li>**Google Play Services:** App distribution and core Android APIs.</li>
          </ul>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="5. Children's Privacy" icon={UserCheck} />
        <Card padding="lg" radius="3xl" className="text-slate-600 leading-relaxed font-bold text-sm">
          Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="6. Your Rights (GDPR)" icon={Trash2} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold">
          <p className="text-sm">
            Under the **GDPR**, you have the right to access, update, or delete your information. You can do this at any time by contacting us:
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-slate-800 font-black mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Request Deletion
            </h3>
            <p className="text-sm">
              Send an email to: <strong className="text-primary">egaldeutsch.com@gmail.com</strong>
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="7. Data Controller" icon={Globe} />
        <Card padding="lg" radius="3xl" className="text-slate-600 leading-relaxed font-bold text-sm">
          Steve Phan<br />
          Dorfstraße 35P<br />
          13057 Berlin, Germany<br />
          Email: egaldeutsch.com@gmail.com
        </Card>
      </div>
    </div>
  );
}

function GermanPolicy() {
  return (
    <div className="space-y-12">
      <div className="space-y-6 text-slate-600 text-sm leading-relaxed font-bold">
        <p>
          EgalDeutsch ("wir", "unser" oder "uns") betreibt die mobile Anwendung EgalDeutsch. Diese Seite informiert Sie über unsere Richtlinien zur Erhebung, Verwendung und Weitergabe personenbezogener Daten bei der Nutzung unseres Dienstes.
        </p>
      </div>

      <div className="space-y-6">
        <SectionTitle title="1. Datenerhebung & Verwendung" icon={Smartphone} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold">
          <div className="space-y-3">
            <h3 className="text-slate-800 font-black">a. Personenbezogene Daten</h3>
            <p className="text-sm">
              Während der Nutzung unseres Dienstes bitten wir Sie möglicherweise, uns bestimmte personenbezogene Daten bereitzustellen, darunter:
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Vorname und Nachname</li>
              <li>Profilbild (via Google Login)</li>
              <li>Sprachpräferenzen</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-slate-800 font-black">b. Log-Daten</h3>
            <p className="text-sm">
              Wir erfassen Informationen, die Ihr Gerät sendet, wie IP-Adresse, Gerätetyp, eindeutige Gerätekennungen und andere Diagnosedaten zur Gewährleistung der App-Sicherheit.
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="2. Berechtigungen & Audiodaten" icon={Lock} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold">
          <p className="text-sm">
            Für das Aussprache-Coaching benötigen wir Zugriff auf Ihr **Mikrofon (RECORD_AUDIO)**.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Die Verarbeitung erfolgt via **Google ML Kit** für direktes Feedback.</li>
            <li>Wir speichern keine Audioaufnahmen dauerhaft auf unseren Servern.</li>
          </ul>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="3. Aufbewahrung von Daten" icon={History} />
        <Card padding="lg" radius="3xl" className="text-slate-600 leading-relaxed font-bold text-sm">
          Wir bewahren Ihre personenbezogenen Daten nur so lange auf, wie dies für die in dieser Datenschutzerklärung dargelegten Zwecke erforderlich ist. Daten werden gelöscht, sobald Sie Ihr Konto löschen oder die gesetzlichen Aufbewahrungsfristen abgelaufen sind.
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="4. Drittanbieter" icon={Share2} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold text-sm">
          <p>Wir beauftragen folgende Drittanbieter mit der Verarbeitung von Daten:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>**Google Cloud Platform:** Hosting und Infrastruktur.</li>
            <li>**Google ML Kit:** Lokale Spracherkennung auf dem Gerät.</li>
            <li>**Google Play Services:** App-Distribution und Core-APIs.</li>
          </ul>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="5. Privatsphäre von Kindern" icon={UserCheck} />
        <Card padding="lg" radius="3xl" className="text-slate-600 leading-relaxed font-bold text-sm">
          Unser Dienst richtet sich nicht an Personen unter 13 Jahren. Wir sammeln wissentlich keine personenbezogenen Daten von Kindern unter 13 Jahren. Sollten wir erfahren, dass ein Kind uns Daten übermittelt hat, werden wir diese umgehend löschen.
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="6. Ihre Rechte (DSGVO)" icon={Trash2} />
        <Card padding="lg" radius="3xl" className="space-y-4 text-slate-600 leading-relaxed font-bold">
          <p className="text-sm">
            Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten (Art. 15-17 DSGVO).
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h3 className="text-slate-800 font-black mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Löschantrag stellen
            </h3>
            <p className="text-sm">
              E-Mail an: <strong className="text-primary">egaldeutsch.com@gmail.com</strong>
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <SectionTitle title="7. Verantwortliche Stelle" icon={Globe} />
        <Card padding="lg" radius="3xl" className="text-slate-600 leading-relaxed font-bold text-sm">
          Steve Phan<br />
          Dorfstraße 35P<br />
          13057 Berlin, Deutschland<br />
          E-Mail: egaldeutsch.com@gmail.com
        </Card>
      </div>
    </div>
  );
}
