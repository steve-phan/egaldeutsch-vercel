import { Idiom } from "@/types/idiom";
import { Metadata } from "next";
import { API_ROUTES, BACKEND_URL } from "@/lib/constants";
import { AppShell } from "@/components/layout/app-shell";
import { IdiomCard } from "@/components/idioms/idiom-card";

export const metadata: Metadata = {
  title: "Redewendung — German Idioms Directory",
  description: "Explore the colorful world of German idioms. meanings, origins, and examples for learners of all levels.",
};

async function getIdioms(): Promise<Idiom[]> {
  try {
    const res = await fetch(`${BACKEND_URL}${API_ROUTES.IDIOMS}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch idioms:", error);
    return [];
  }
}

export default async function IdiomsDirectory() {
  const idioms = await getIdioms();

  return (
    <AppShell showNav={true} maxWidth="lg">
      <div className="space-y-12 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic">
            Redewendung
          </h1>
          <p className="text-slate-500 font-bold max-w-xl mx-auto">
            German is a colorful language. Master these idioms to sound more like a native speaker and understand the culture better.
          </p>
        </div>

        {/* Grid */}
        {idioms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {idioms.map((idiom) => (
              <IdiomCard key={idiom.id} idiom={idiom} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6 opacity-20 grayscale">🥨</div>
            <h2 className="text-2xl font-black text-slate-800 italic">No idioms found</h2>
            <p className="text-slate-400 font-bold">Please check back later or start the backend server.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
