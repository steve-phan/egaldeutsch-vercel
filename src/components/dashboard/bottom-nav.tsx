"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Book, MessageSquare, Bell, User } from "lucide-react";

const NAV_ITEMS = [
  { icon: <Book className="w-5 h-5" />, label: "Lessons", href: "/lessons" },
  { icon: <MessageSquare className="w-5 h-5" />, label: "Chat", href: "/chat" },
  { icon: <Bell className="w-5 h-5" />, label: "Notifs", href: "/notifications" },
  { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none">
      <nav className="glass-pill h-16 w-full max-w-[400px] rounded-full px-2 flex items-center justify-between pointer-events-auto">
        {/* Left Links */}
        <div className="flex flex-1 justify-around">
          <NavItem 
            href={NAV_ITEMS[0].href} 
            icon={NAV_ITEMS[0].icon} 
            isActive={pathname === NAV_ITEMS[0].href} 
          />
          <NavItem 
            href={NAV_ITEMS[1].href} 
            icon={NAV_ITEMS[1].icon} 
            isActive={pathname === NAV_ITEMS[1].href} 
          />
        </div>

        {/* Central Hub (Home) */}
        <Link href="/" className="relative -top-3 scale-110 transition-transform hover:scale-125 duration-300">
           <div className={`w-14 h-14 rounded-full border-4 border-background shadow-floating flex items-center justify-center transition-all ${pathname === "/" ? "bg-primary" : "bg-white"}`}>
              <div className="relative w-8 h-8">
                 <Image 
                   src="/icon.png" 
                   alt="Home" 
                   fill 
                   className={`object-contain transition-all ${pathname === "/" ? "brightness-200" : ""}`} 
                 />
              </div>
           </div>
        </Link>

        {/* Right Links */}
        <div className="flex flex-1 justify-around">
          <NavItem 
            href={NAV_ITEMS[2].href} 
            icon={NAV_ITEMS[2].icon} 
            isActive={pathname === NAV_ITEMS[2].href} 
          />
          <NavItem 
            href={NAV_ITEMS[3].href} 
            icon={NAV_ITEMS[3].icon} 
            isActive={pathname === NAV_ITEMS[3].href} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, icon, isActive }: { href: string, icon: React.ReactNode, isActive: boolean }) {
  return (
    <Link href={href}>
      <button 
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
          isActive 
            ? "text-primary bg-primary/10 shadow-sm" 
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        }`}
      >
        {icon}
      </button>
    </Link>
  );
}
