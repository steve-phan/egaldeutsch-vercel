import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full max-w-5xl mb-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-slate-900">EgalDeutsch</h1>
      <div className="flex gap-4 items-center">
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
