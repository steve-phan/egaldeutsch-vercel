"use client";

import { useState, useCallback, useEffect } from "react";
import { API_ROUTES } from "@/lib/constants";
import { useApiClient } from "@/hooks/use-api-client";

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
  const { request, isAuthenticated } = useApiClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await request(API_ROUTES.NOTIFICATIONS);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, request]);

  const markAsRead = useCallback(async (id?: string) => {
    try {
      const res = await request(API_ROUTES.NOTIFICATIONS_READ, {
        method: "POST",
        query: { id },
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (id === undefined || n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, [request]);

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
