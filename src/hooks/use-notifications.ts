"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "achievement" | "streak" | "system" | "social";
  link?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);
    try {
      const token = (session.user as any).accessToken;
      const res = await fetch("/api/user/notifications", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const markAsRead = useCallback(async (id?: string) => {
    try {
      const token = (session?.user as any)?.accessToken;
      const url = id ? `/api/user/notifications/read?id=${id}` : "/api/user/notifications/read";
      const res = await fetch(url, { 
        method: "POST",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (id === undefined || n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, [session]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    refresh: fetchNotifications
  };
}
