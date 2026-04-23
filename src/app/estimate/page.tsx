import { Metadata } from "next";
import { EstimateClientView } from "@/components/estimate/estimate-client-view";

export const metadata: Metadata = {
  title: "Estimate Your German Level — EgalDeutsch",
  description: "Take our interactive 30-question test to find out your current CEFR German level (A1-B2) instantly.",
  alternates: {
    canonical: "/estimate",
  },
};

export default function EstimatePage() {
  return <EstimateClientView />;
}
