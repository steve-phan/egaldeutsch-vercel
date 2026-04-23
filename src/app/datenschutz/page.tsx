import { Metadata } from "next";
import { DatenschutzClientView } from "@/components/layout/legal/datenschutz-client-view";

export const metadata: Metadata = {
  title: "Datenschutz — Privacy Policy",
  description: "Learn how we handle your personal data and protect your privacy on EgalDeutsch in accordance with GDPR.",
  alternates: {
    canonical: "/datenschutz",
  },
  robots: { index: false, follow: true }, // Legal pages shouldn't distract from main content but should be reachable
};

export default function DatenschutzPage() {
  return <DatenschutzClientView />;
}
