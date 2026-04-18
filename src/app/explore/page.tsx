import { Metadata } from "next";
import { ExploreClientView } from "@/components/explore/explore-client-view";

export const metadata: Metadata = {
  title: "Discovery Centre — Explore German Grammar",
  description: "Explore our library of German grammar modules. From A1 nouns to B2 Beruf and complex word order missions. Find your next challenge.",
  openGraph: {
    title: "EgalDeutsch Discovery Centre",
    description: "Your gateway to mastering German grammar through interactive missions.",
  }
};

export default function ExplorePage() {
  return <ExploreClientView />;
}
