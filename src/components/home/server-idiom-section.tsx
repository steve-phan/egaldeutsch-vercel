import { API_ROUTES, apiUrl } from "@/lib/constants";
import { RandomIdiom } from "@/components/idioms/random-idiom";

async function getRandomIdiom() {
  try {
    const res = await fetch(apiUrl(API_ROUTES.IDIOM_RANDOM), { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch random idiom:", error);
    return null;
  }
}

export async function ServerIdiomSection() {
  const idiom = await getRandomIdiom();
  return <RandomIdiom initialIdiom={idiom} />;
}
