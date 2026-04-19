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

      const token = session?.user?.accessToken;
      const response = await fetch(API_ROUTES.FEEDBACK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to submit feedback";
        
        if (contentType && contentType.includes("application/json")) {
           const errorData = await response.json();
           errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
           // If it's HTML (likely a 404/500 page), use a generic error
           if (response.status === 404) errorMessage = "Feedback service temporarily unavailable (404)";
           else if (response.status === 500) errorMessage = "Server error occurred. Please try again later.";
        }
        
        throw new Error(errorMessage);
      }

      setSuccess(true);
      return await response.json();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken]);

  const fetchAllFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = session?.user?.accessToken;
      const response = await fetch(API_ROUTES.ADMIN_FEEDBACK, {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized: Admin access required");
        throw new Error("Failed to fetch feedback");
      }

      return await response.json();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken]);

  return {
    submitFeedback,
    fetchAllFeedback,
    loading,
    error,
    success,
    setSuccess
  };
}
