"use client";

import { Target, Languages } from "lucide-react";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface PreferencesSectionProps {
  languages: LanguageOption[];
  language: string;
  setLanguage: (lang: string) => void;
}

export function PreferencesSection({ languages, language, setLanguage }: PreferencesSectionProps) {
  return (
    <div className="mt-12 pt-10 border-t border-slate-50 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
          <Languages className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight italic">App Preferences</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Set your learning language</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              setLanguage(lang.code);
            }}
            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${language === lang.code
              ? "border-primary bg-primary/5 shadow-inner"
              : "border-slate-50 bg-white hover:border-slate-200"
              }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl group-hover:scale-110 transition-transform">{lang.flag}</span>
              <span className={`text-xs font-black uppercase tracking-widest ${language === lang.code ? "text-primary" : "text-slate-500"
                }`}>
                {lang.name}
              </span>
            </div>
            {language === lang.code && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
