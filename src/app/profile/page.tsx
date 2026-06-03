"use client";

import { AppShell } from "@/components/layout/app-shell";
import { IdentitySection } from "@/components/profile/IdentitySection";
import { MasteryHero } from "@/components/profile/MasteryHero";
import { ProgressTab } from "@/components/profile/ProgressTab";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { Card } from "@/components/shared/layout/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { useProfile } from "@/hooks/use-profile";
import {
  LayoutDashboard,
  Loader2,
  Settings
} from "lucide-react";
import { calculateLevel } from "@/lib/level-utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

type TabType = "progress" | "settings";

import { useLanguage } from "@/contexts/language-context";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("progress");

  const {
    name, setName, email, setEmail, language, setLanguage,
    loading: profileLoading, saving, error, success, handleSubmit
  } = useProfile();

  const { stats, loading: statsLoading } = useDashboard();

  const loading = profileLoading || statsLoading || status === "loading";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // Should be handled by middleware, but safe to keep
  }

  const accuracyProgress = stats?.accuracy || 0;
  const levelInfo = calculateLevel(accuracyProgress);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  return (
    <AppShell showNav={true} maxWidth="md">
      <div className="w-full pb-24 pt-6 space-y-8 animate-in fade-in duration-700 px-4 md:px-0">

        <MasteryHero
          session={session}
          currentLevel={levelInfo.current}
        />

        {/* Dynamic Tab Navigation */}
        <nav className="flex justify-center">
          <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-inner max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex items-center gap-2 px-6 md:px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "progress" ? "bg-white text-primary shadow-premium-sm scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> {t("profile.tabs.progress")}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-6 md:px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "settings" ? "bg-white text-primary shadow-premium-sm scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <Settings className="w-3.5 h-3.5" /> {t("profile.tabs.settings")}
            </button>
          </div>
        </nav>

        {/* Tab Content Display */}
        <div className="min-h-[400px]">
          {activeTab === "progress" && (
            <ProgressTab
              accuracyProgress={accuracyProgress}
              levelInfo={levelInfo}
              stats={stats}
            />
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <Card padding="lg" glass>
                <IdentitySection
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  language={language}
                  setLanguage={setLanguage}
                  languages={languages}
                  handleSubmit={handleSubmit}
                  saving={saving}
                  error={error}
                  success={success}
                />

                <SecuritySection accessToken={session.user.accessToken} />
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
