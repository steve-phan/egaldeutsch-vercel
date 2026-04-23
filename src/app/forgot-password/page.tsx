import { Metadata } from "next";
import { ForgotPasswordClientView } from "@/components/auth/forgot-password-client-view";

export const metadata: Metadata = {
  title: "Forgot Password — EgalDeutsch",
  description: "Recover your EgalDeutsch account by resetting your password.",
  alternates: {
    canonical: "/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientView />;
}
