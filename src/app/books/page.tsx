import Link from "next/link";
import { BookMarked, GraduationCap, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export const metadata = {
  title: "German Learning Books | EgalDeutsch",
  description:
    "Choose a structured German learning book: Road to B2 or Road to C1.",
  alternates: {
    canonical: "/books",
  },
};

const books = [
  {
    href: "/road-to-b2",
    level: "B1 → B2",
    title: "Road to B2 Deutsch",
    description:
      "Build strong B2 grammar, vocabulary, writing, speaking and exam routines.",
    icon: GraduationCap,
  },
  {
    href: "/road-to-c1",
    level: "B2 → C1",
    title: "Von B2 zu telc C1",
    description:
      "Train advanced argumentation, C1 Redemittel and telc C1 exam strategy.",
    icon: BookMarked,
  },
];

export default function BooksPage() {
  return (
    <AppShell showNav maxWidth="lg">
      <div className="pb-24 pt-8 sm:pt-12">
        <div className="mb-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-4 w-4" />
            Learning paths
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Choose your German book
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
            Structured chapter-by-chapter books for serious German progress.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {books.map((book) => {
            const Icon = book.icon;

            return (
              <Link
                key={book.href}
                href={book.href}
                className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium transition-colors hover:border-primary/20 hover:bg-primary/5"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-primary">
                  {book.level}
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {book.title}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {book.description}
                </p>
                <span className="mt-6 inline-flex text-sm font-black uppercase tracking-widest text-primary">
                  Open book →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
