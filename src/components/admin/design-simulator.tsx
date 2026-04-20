"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/shared/layout/card";
import { Brand } from "@/components/shared/brand";
import { Sparkles, Smartphone, Type, Ruler, AlignLeft, AlignCenter, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesignSimulator() {
  const [fontSize, setFontSize] = useState(16);
  const [spacing, setSpacing] = useState(24);
  const [alignment, setAlignment] = useState<"left" | "center">("left");

  // Logic for scores
  const mobileScore = useMemo(() => {
    let score = 100;
    if (fontSize < 16) score -= (16 - fontSize) * 10;
    if (spacing < 16) score -= (16 - spacing) * 5;
    return Math.max(0, Math.min(100, score));
  }, [fontSize, spacing]);

  const harmonyScore = useMemo(() => {
    // Harmony is high when spacing is proportional to font size (e.g. 1.5x)
    const idealSpacing = fontSize * 1.5;
    const diff = Math.abs(spacing - idealSpacing);
    let score = 100 - diff * 2;
    
    // Alignment logic (Yin/Yang balance)
    // For EgalDeutsch, a mix of center (yin) for branding and left (yang) for content is best
    // In this simulator mockup, let's say "Center" align for short headers is very harmonious
    if (alignment === "center") score += 5; 
    
    return Math.max(0, Math.min(100, score));
  }, [fontSize, spacing, alignment]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6 space-y-8 border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-premium">
          <div className="space-y-1">
            <h3 className="text-lg font-black italic text-slate-800 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" /> Thiết lập Hòa Khí
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tùy chỉnh dòng chảy năng lượng</p>
          </div>

          {/* Font Size Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Type className="w-4 h-4" /> Kích thước chữ
              </label>
              <span className="text-sm font-black text-primary">{fontSize}px</span>
            </div>
            <input 
              type="range" min="12" max="32" value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Spacing Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Ruler className="w-4 h-4" /> Khoảng cách (Spacing)
              </label>
              <span className="text-sm font-black text-primary">{spacing}px</span>
            </div>
            <input 
              type="range" min="8" max="64" value={spacing} 
              onChange={(e) => setSpacing(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Alignment Control */}
          <div className="space-y-4">
             <label className="text-xs font-black uppercase tracking-wider text-slate-600">Căn lề (Yin/Yang)</label>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setAlignment("left")}
                  className={cn(
                    "h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-black text-xs uppercase italic",
                    alignment === "left" ? "border-primary bg-primary/5 text-primary" : "border-slate-50 text-slate-400 hover:border-slate-100"
                  )}
                >
                  <AlignLeft className="w-4 h-4" /> Dương (Left)
                </button>
                <button 
                  onClick={() => setAlignment("center")}
                  className={cn(
                    "h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-black text-xs uppercase italic",
                    alignment === "center" ? "border-primary bg-primary/5 text-primary" : "border-slate-50 text-slate-400 hover:border-slate-100"
                  )}
                >
                  <AlignCenter className="w-4 h-4" /> Âm (Center)
                </button>
             </div>
          </div>
        </Card>

        {/* Scoring Gauges */}
        <div className="grid grid-cols-2 gap-4">
           <ScoreGauge label="Mobile First" score={mobileScore} color="emerald" />
           <ScoreGauge label="Hòa Khí" score={harmonyScore} color="primary" />
        </div>
      </div>

      {/* Mobile Preview Area */}
      <div className="lg:col-span-8 flex justify-center">
        <div className="relative w-[360px] h-[720px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800">
           {/* Mobile Content Screen */}
           <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative bg-noise">
              {/* Fake Status Bar */}
              <div className="h-6 w-full flex justify-between items-center px-6 pt-2">
                 <span className="text-[10px] font-bold text-slate-400">9:41</span>
                 <div className="flex gap-1">
                   <div className="w-3 h-3 rounded-full bg-slate-200" />
                   <div className="w-3 h-3 rounded-full bg-slate-200" />
                 </div>
              </div>

              {/* Simulation Content */}
              <div 
                className="flex-1 p-6 transition-all duration-300 overflow-y-auto"
                style={{ padding: `${spacing}px` }}
              >
                 <div className={cn("space-y-6", alignment === "center" ? "text-center" : "text-left")}>
                    <Brand size="md" />
                    
                    <div style={{ marginBottom: `${spacing}px` }}>
                       <h1 
                         className="font-black italic text-slate-900 leading-[1.1] transition-all"
                         style={{ fontSize: `${Math.max(24, fontSize * 1.5)}px` }}
                       >
                         Master German, <span className="text-primary">Egal Wie!</span>
                       </h1>
                       <p 
                         className="font-bold text-slate-500 mt-4 transition-all"
                         style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                       >
                         Cùng nhau khám phá dòng chảy năng lượng trong ngôn ngữ và thiết kế.
                       </p>
                    </div>

                    <Card 
                      className="p-6 border-slate-200/50 shadow-sm"
                      style={{ padding: `${spacing * 0.75}px` }}
                    >
                       <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Progress</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-primary rounded-full" />
                       </div>
                    </Card>

                    <div className="pt-4 flex flex-col gap-3">
                       <button 
                         className="h-14 w-full bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                          Bắt đầu học ngay
                       </button>
                       <button className="h-12 w-full bg-white border border-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest">
                          Tìm hiểu thêm
                       </button>
                    </div>
                 </div>
              </div>

              {/* Fake Home Indicator */}
              <div className="h-1.5 w-32 bg-slate-200 rounded-full mx-auto mb-2" />
           </div>
        </div>
      </div>
    </div>
  );
}

function ScoreGauge({ label, score, color }: { label: string, score: number, color: string }) {
  const rotation = (score / 100) * 180 - 90;
  
  return (
    <Card className="p-4 flex flex-col items-center justify-center space-y-3 bg-white/60 backdrop-blur-md border-slate-100">
       <div className="relative w-20 h-10 overflow-hidden">
          {/* Semicircle Track */}
          <div className="absolute top-0 w-20 h-20 rounded-full border-[8px] border-slate-100" />
          {/* Animated Needle */}
          <div 
            className="absolute bottom-0 left-1/2 w-0.5 h-10 origin-bottom bg-slate-800 transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800" />
       </div>
       <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className={cn("text-xl font-black italic", score >= 85 ? "text-emerald-600" : score >= 60 ? "text-primary" : "text-amber-500")}>
            {score}%
          </p>
       </div>
    </Card>
  );
}
