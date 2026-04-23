import { Metadata } from "next";
import { SignupClientView } from "@/components/auth/signup-client-view";

export const metadata: Metadata = {
  title: "Create Account — EgalDeutsch",
  description: "Start your German language mastery today by creating a free EgalDeutsch account.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
    return <SignupClientView />;
}
