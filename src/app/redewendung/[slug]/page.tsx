import { AppShell } from "@/components/layout/app-shell";
import { IdiomDetail } from "@/components/idioms/idiom-detail";
import { Idiom } from "@/types/idiom";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkles, LayoutGrid } from "lucide-react";
import { API_ROUTES, BACKEND_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getIdiom(slug: string): Promise<Idiom | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${API_ROUTES.IDIOM_DETAIL}${slug}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return null;
    }

    return res.json();
  } catch (error) {
    console.warn(`Failed to fetch idiom [${slug}]:`, error);
    return null;
  }
}

// Helper to fetch a random slug for "Next" navigation
async function getRandomSlug(): Promise<string | null> {
    try {
        const res = await fetch(`${BACKEND_URL}${API_ROUTES.IDIOM_RANDOM}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(3000),
        });

        if (!res.ok) return null;

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return null;
        }

        const data = await res.json();
        return data.slug;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idiom = await getIdiom(slug);

  if (!idiom) {
    return {
      title: "Idiom Not Found — EgalDeutsch",
    };
  }

  const isUrl = (str?: string) => str?.startsWith("http") || str?.startsWith("/");
  const ogImage = isUrl(idiom.thumbnail) ? idiom.thumbnail! : "/og-image.png";

  return {
    title: `${idiom.title} — German Idiom Meaning & Origin`,
    description: idiom.meaning_de,
    openGraph: {
      title: idiom.title,
      description: idiom.meaning_de,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: idiom.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: idiom.title,
      description: idiom.meaning_de,
      images: [ogImage],
    },
  };
}

export default async function IdiomDetailPage({ params }: Props) {
  const { slug } = await params;
  const idiom = await getIdiom(slug);
  const nextSlug = await getRandomSlug();

  if (!idiom) {
    notFound();
  }

  return (
    <AppShell showNav={false} maxWidth="lg">
      <div className="pt-6">
        {/* Navigation Top */}
        <div className="flex items-center justify-between mb-8">
            <Link 
            href="/redewendung"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-premium hover:text-primary transition-colors"
            >
            <ChevronLeft className="w-4 h-4" />
            Back to Directory
            </Link>
        </div>

        {/* Content */}
        <IdiomDetail idiom={idiom} />

        {/* Footer Navigation CTAs */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 pb-20">
            {nextSlug && nextSlug !== slug && (
                <Link 
                    href={`/redewendung/${nextSlug}`}
                    className="btn-orange h-14 px-10 group min-w-[240px]"
                >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Discover Another
                </Link>
            )}
            
            <Link 
                href="/redewendung"
                className="btn-dark h-14 px-10 group min-w-[240px]"
            >
                <LayoutGrid className="w-5 h-5" />
                Explore All Idioms
            </Link>
        </div>
      </div>
    </AppShell>
  );
}
