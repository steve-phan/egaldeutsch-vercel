"use client";

import { useEffect } from "react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { UserTable } from "@/components/admin/users/user-table";
import { Users, Search, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminUsersPage() {
  const { users, loading, error, fetchUsers, deleteUser } = useAdminUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 space-y-12">
      {/* Header section */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft className="w-3 h-3" /> Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-[2rem] shadow-premium flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
               <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">User Hub</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Management & Permissions</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => fetchUsers()}
             disabled={loading}
             className="h-12 w-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm group"
           >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : "group-active:rotate-180 transition-transform duration-500"}`} />
           </button>
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search citizens..." 
                className="h-12 pl-12 pr-6 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all w-48 md:w-64"
              />
           </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-5xl mx-auto">
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] text-rose-500 text-sm font-bold mb-8 animate-in shake-1 duration-500">
             {error}
          </div>
        )}

        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading user records...</p>
          </div>
        ) : (
          <UserTable 
            users={users} 
            onDelete={deleteUser} 
            isDeleting={loading} 
          />
        )}
      </div>

      {/* Footer / Stats */}
      <div className="max-w-5xl mx-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
         <div>Total Citizens: {users.length}</div>
         <div className="italic">EgalDeutsch Administrative Terminal</div>
      </div>
    </div>
  );
}
