import { Metadata } from "next";
import { ExploreClientView } from "@/components/explore/explore-client-view";

export const metadata: Metadata = {
  title: "Discovery Centre — Explore German Grammar",
  description: "Explore our library of German grammar modules. From A1 nouns to B2 Beruf and complex word order missions. Find your next challenge.",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: "EgalDeutsch Discovery Centre",
    description: "Your gateway to mastering German grammar through interactive missions.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Explore German Grammar on EgalDeutsch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore German Grammar — EgalDeutsch",
    description: "Discover interactive German grammar modules and missions.",
    images: ["/og-image.png"],
  },
};

export default function ExplorePage() {
  return <ExploreClientView />;
}
