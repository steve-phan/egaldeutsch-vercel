import { Metadata } from "next";
import { ImpressumClientView } from "@/components/layout/legal/impressum-client-view";

export const metadata: Metadata = {
  title: "Impressum — Legal Notice",
  description: "Legal information about EgalDeutsch, our contact details, and publisher information in accordance with § 5 TMG.",
  alternates: {
    canonical: "/impressum",
  },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return <ImpressumClientView />;
}
