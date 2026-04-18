"use client";

import { AdminUser } from "@/hooks/use-admin-users";
import { Trash2, User, Mail, Calendar } from "lucide-react";
import { Card } from "@/components/shared/layout/card";

interface UserTableProps {
  users: AdminUser[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function UserTable({ users, onDelete, isDeleting }: UserTableProps) {

  if (users.length === 0) {
    return (
      <Card padding="xl" radius="3xl" className="text-center animate-in zoom-in-95 duration-700">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No users found in database.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, idx) => (
        <Card
          key={user.id}
          padding="md"
          radius="2xl"
          hover
          className="flex flex-col md:flex-row items-center justify-between gap-6 group animate-in slide-in-from-left-4 duration-500"
        >
          <div className="flex items-center gap-6 flex-1 w-full">
            {/* User Avatar Placeholder */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <User className="w-5 h-5" />
              </div>
              <div className={`text-[8px] font-black text-center uppercase tracking-widest px-2 py-0.5 rounded-full border ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-500 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                {user.role || 'user'}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tight italic leading-none">{user.name}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{user.email}</span>
                </div>
                {user.created_at && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to remove ${user.name}?`)) onDelete(user.id);
              }}
              disabled={isDeleting || user.role === 'admin'}
              className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-sm transition-all
                  ${user.role === 'admin'
                  ? 'bg-slate-50 text-slate-200 cursor-not-allowed border border-slate-100'
                  : 'bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-100'}
               `}
              title={user.role === 'admin' ? "Cannot delete admin users" : "Delete user"}
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
