import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useLanguage, Language } from "@/contexts/language-context";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <nav className="w-full max-w-6xl mb-12 flex justify-between items-center px-4 py-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">EgalDeutsch</h1>
      <div className="flex gap-4 items-center">
        {/* Language Selection */}
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-slate-100 border-none text-slate-700 text-sm font-semibold rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
        >
          <option value="en">🇬🇧 EN</option>
          <option value="de">🇩🇪 DE</option>
          <option value="vi">🇻🇳 VI</option>
        </select>
        
        <div className="w-px h-6 bg-slate-200 hidden sm:block" />
        {isAuthenticated ? (
          <>
            <span className="text-sm text-slate-600">Hello, {user?.name}</span>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm">Profile</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
