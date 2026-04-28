import { Metadata } from "next";
import { AppPrivacyPolicyClientView } from "@/components/layout/legal/app-privacy-policy-view";

export const metadata: Metadata = {
  title: "Privacy Policy — EgalDeutsch App",
  description: "Privacy policy for the EgalDeutsch mobile application. Information on data collection, processing, and user rights.",
  alternates: {
    canonical: "/privicy-app",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyAppPage() {
  return <AppPrivacyPolicyClientView />;
}
