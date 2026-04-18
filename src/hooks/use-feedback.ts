import { useState, useCallback } from "react";
import { API_ROUTES } from "@/lib/constants";
import { useSession } from "next-auth/react";

export interface FeedbackSubmission {
  category: string;
  message: string;
  rating: number;
  hp_website?: string;
  guest_email?: string;
}

export interface FeedbackRecord extends FeedbackSubmission {
  id: string;
  user_id?: string;
  user_name?: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export function useFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  const submitFeedback = useCallback(async (data: FeedbackSubmission) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to submit feedback");
      }

      setSuccess(true);
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/feedback");

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized: Admin access required");
        throw new Error("Failed to fetch feedback");
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitFeedback,
    fetchAllFeedback,
    loading,
    error,
    success,
    setSuccess
  };
}
