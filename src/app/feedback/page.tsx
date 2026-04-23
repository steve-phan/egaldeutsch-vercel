import { Metadata } from "next";
import { FeedbackClientView } from "@/components/feedback/feedback-client-view";

export const metadata: Metadata = {
  title: "Feedback Hub — EgalDeutsch",
  description: "Help us curate the perfect learning experience. Share your bugs, feature requests, or praise for EgalDeutsch.",
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    title: "Feedback Hub — EgalDeutsch",
    description: "Help us curate the perfect learning experience.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Feedback Hub on EgalDeutsch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feedback Hub — EgalDeutsch",
    description: "Share your feedback and help us improve.",
    images: ["/og-image.png"],
  },
};

export default function FeedbackPage() {
   return <FeedbackClientView />;
}
