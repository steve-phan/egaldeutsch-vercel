"use client";

import { useState, useCallback } from "react";
import { API_ROUTES, apiRequest } from "@/lib/constants";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await apiRequest(API_ROUTES.FORGOT_PASSWORD, {
        method: "POST",
        json: true,
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess("If an account exists, a reset link has been sent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [email]);

  return { email, setEmail, loading, error, success, handleSubmit };
}
