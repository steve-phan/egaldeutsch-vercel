import { DeleteConfirmClientView } from "@/components/layout/legal/delete-confirm-client-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Deletion — EgalDeutsch",
  description: "Confirm the permanent deletion of your EgalDeutsch account.",
  robots: { index: false, follow: false },
};

export default function DeleteConfirmPage() {
  return <DeleteConfirmClientView />;
}
