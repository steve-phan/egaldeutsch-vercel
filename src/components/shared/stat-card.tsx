"use client";

import { Card } from "@/components/shared/layout/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  delay?: number;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = "bg-primary",
  delay = 0,
  className
}: StatCardProps) {
  return (
    <Card
      padding="md"
      radius="3xl"
      hover
      className={cn("flex flex-col justify-between h-full group animate-in zoom-in-95 duration-700", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
          <span className="text-3xl font-black text-slate-800 tracking-tighter italic leading-none">{value}</span>
        </div>
        {icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500", color)}>
            {icon}
          </div>
        )}
      </div>

      <div className="h-1 w-full bg-slate-50/50 rounded-full overflow-hidden">
        <div className={cn("h-full w-2/3 rounded-full opacity-50", color)} />
      </div>
    </Card>
  );
}
