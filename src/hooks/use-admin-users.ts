import { useState, useCallback } from "react";
import { API_ROUTES } from "@/lib/constants";
import { useApiClient } from "@/hooks/use-api-client";

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
  const { request } = useApiClient();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request(API_ROUTES.ADMIN_USERS);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [request]);

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      const res = await request(API_ROUTES.ADMIN_USERS, {
        method: "DELETE",
        query: { id },
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
