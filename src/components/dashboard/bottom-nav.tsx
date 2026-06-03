"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  HeartHandshake,
  GraduationCap,
  Home,
  MoreHorizontal,
  User,
  Sparkles,
} from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const navItems = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    isActive: (pathname: string) => pathname === "/",
    showBadge: false,
  },
  {
    icon: GraduationCap,
    label: "Practice",
    href: "/practice",
    isActive: (pathname: string) =>
      pathname === "/practice" || pathname.startsWith("/quiz"),
    showBadge: false,
  },
  {
    icon: BookOpen,
    label: "Blog",
    href: "/blogs",
    isActive: (pathname: string) => pathname.startsWith("/blogs"),
    showBadge: false,
  },
  {
    icon: Sparkles,
    label: "Idioms",
    href: "/redewendung",
    isActive: (pathname: string) => pathname.startsWith("/redewendung"),
    showBadge: false,
  },
] as const;

const moreItems = [
  {
    icon: Bell,
    label: "Notifications",
    href: "/notifications",
    isActive: (pathname: string) => pathname.startsWith("/notifications"),
    showBadge: true,
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
    isActive: (pathname: string) => pathname.startsWith("/profile"),
    showBadge: false,
  },
  {
    icon: HeartHandshake,
    label: "Feedback",
    href: "/feedback",
    isActive: (pathname: string) => pathname.startsWith("/feedback"),
    showBadge: false,
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isMoreActive = moreItems.some((item) => item.isActive(pathname));
  const hasUnread = typeof unreadCount === "number" && unreadCount > 0;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden"
      aria-label="Primary mobile navigation"
    >
      {isMoreOpen ? (
        <div className="absolute inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active = item.isActive(pathname);
              const showUnreadBadge = item.showBadge && hasUnread;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[10px] font-black transition-all active:scale-95",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                  )}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                    <Icon className="h-5 w-5" />
                    {showUnreadBadge ? (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black leading-none text-white ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate leading-none">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-md grid-cols-5 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMoreOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-black transition-all active:scale-95",
                active
                  ? "text-primary"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
              )}
            >
              {active ? (
                <span className="absolute -top-2 h-1 w-8 rounded-full bg-primary" />
              ) : null}
              <span
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-xl transition-colors",
                  active && "bg-primary/10",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setIsMoreOpen((current) => !current)}
          aria-expanded={isMoreOpen}
          aria-label="More navigation"
          className={cn(
            "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-black transition-all active:scale-95",
            isMoreActive || isMoreOpen
              ? "text-primary"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
          )}
        >
          {isMoreActive || isMoreOpen ? (
            <span className="absolute -top-2 h-1 w-8 rounded-full bg-primary" />
          ) : null}
          <span
            className={cn(
              "relative flex h-7 w-7 items-center justify-center rounded-xl transition-colors",
              (isMoreActive || isMoreOpen) && "bg-primary/10",
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            {hasUnread ? (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black leading-none text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </span>
          <span className="truncate leading-none">More</span>
        </button>
      </div>
    </nav>
  );
}
