import { useState, useCallback } from "react";
import { API_ROUTES } from "@/lib/constants";
import { useSession } from "next-auth/react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
}

interface UseAdminUsersResult {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<boolean>;
}

export function useAdminUsers(): UseAdminUsersResult {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const token = (session?.user as any)?.accessToken;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.ADMIN_USERS, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ROUTES.ADMIN_USERS}?id=${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setError(null);
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, fetchUsers, deleteUser };
}
