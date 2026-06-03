import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { API_ROUTES, apiRequest } from "@/lib/constants";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  language: string;
  image?: string;
  role?: string;
  created_at?: string;
}

interface UseProfileResult {
  profile: UserProfile | null;
  name: string;
  email: string;
  language: string;
  loading: boolean;
  saving: boolean;
  error: string;
  success: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setLanguage: (lang: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("en");
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
        language: (session.user as { language?: string }).language || "en",
        image: session.user.image || "",
      };
      setProfile(userProfile);
      setName(userProfile.name);
      setEmail(userProfile.email);
      setLanguage(userProfile.language);
    }
    setLoading(false);
  }, [status, session]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = (session?.user as { accessToken?: string })?.accessToken;
      const res = await apiRequest(API_ROUTES.USER_PROFILE, {
        method: "PUT",
        json: true,
        token,
        body: JSON.stringify({ 
          name, 
          email, 
          language: language 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      // Update the session explicitly
      await update({ name, email, language });
      
      // Update language cookie for server-side detection
      document.cookie = `language=${language}; path=/; max-age=31536000; samesite=lax`;
      
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
  }, [name, email, language, update, session?.user, session?.user?.accessToken]);

  return {
    profile,
    name,
    email,
    language,
    loading,
    saving,
    error,
    success,
    setName,
    setEmail,
    setLanguage,
    handleSubmit,
  };
}
