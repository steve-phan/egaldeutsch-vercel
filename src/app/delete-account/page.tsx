import { DeleteAccountClientView } from "@/components/layout/legal/delete-account-client-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account — EgalDeutsch",
  description: "Request the deletion of your EgalDeutsch account and associated personal data in accordance with Google Play and GDPR requirements.",
  alternates: {
    canonical: "/delete-account",
  },
  robots: { index: false, follow: true },
};

export default function DeleteAccountPage() {
  return <DeleteAccountClientView />;
}
