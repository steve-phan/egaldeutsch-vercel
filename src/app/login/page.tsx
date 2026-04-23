import { Metadata } from "next";
import { LoginClientView } from "@/components/auth/login-client-view";

export const metadata: Metadata = {
  title: "Log In — EgalDeutsch",
  description: "Log in to your EgalDeutsch account to continue learning German.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
    return <LoginClientView />;
}
