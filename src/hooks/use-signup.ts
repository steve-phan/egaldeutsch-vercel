import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, type Language } from "@/contexts/language-context";
import { signIn } from "next-auth/react";
import { API_ROUTES, apiRequest } from "@/lib/constants";

interface UseSignupResult {
  name: string;
  email: string;
  password: string;
  language: Language;
  error: string;
  isLoading: boolean;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLanguage: (language: Language) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
}

export function useSignup(): UseSignupResult {
  const { language: initialLanguage } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setIsLoading(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiRequest(API_ROUTES.SIGNUP, {
        method: "POST",
        json: true,
        body: JSON.stringify({ name, email, password, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Redirect to login after successful signup
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, language, router]);

  return {
    name,
    email,
    password,
    language,
    error,
    isLoading,
    setName,
    setEmail,
    setPassword,
    setLanguage,
    handleSubmit,
    handleGoogleLogin,
  };
}
