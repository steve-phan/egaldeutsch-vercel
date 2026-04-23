import { Metadata } from "next";
import { ResetPasswordClientView } from "@/components/auth/reset-password-client-view";

export const metadata: Metadata = {
  title: "Reset Password — EgalDeutsch",
  description: "Securely reset your password and regain access to your German learning profile.",
  alternates: {
    canonical: "/reset-password",
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClientView />;
}
