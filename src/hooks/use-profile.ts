import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  created_at?: string;
}

interface UseProfileResult {
  profile: UserProfile | null;
  name: string;
  email: string;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      const userProfile: UserProfile = {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      };
      setProfile(userProfile);
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
    setLoading(false);
  }, [status, session]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = session?.user?.accessToken;
      const res = await fetch("/api/account/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      // Update the session explicitly
      await update({ name, email });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setSaving(false);
    }
  }, [name, email, update, session?.user?.accessToken]);

  return {
    profile,
    name,
    email,
    loading,
    saving,
    error,
    success,
    setName,
    setEmail,
    handleSubmit,
  };
}
