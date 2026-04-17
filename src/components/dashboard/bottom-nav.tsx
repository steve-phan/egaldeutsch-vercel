"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Book, MessageSquare, Bell, User } from "lucide-react";

const NAV_ITEMS = [
  { icon: <Home />, label: "Home", href: "/" },
  { icon: <Book />, label: "Lessons", href: "/lessons" },
  { icon: <MessageSquare />, label: "Chat", href: "/chat" },
  { icon: <Bell />, label: "Notifs", href: "/notifications" },
  { icon: <User />, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <button 
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                  : "text-slate-300 hover:text-slate-400 hover:bg-slate-50"
              }`}
            >
              {item.icon}
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
