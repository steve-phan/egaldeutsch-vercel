import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import { BlogList } from "@/components/blogs/blog-list";

export const metadata = {
  title: "German Grammar Theory | Egaldeutsch",
  description:
    "Learn German grammar easily with clear explanations, tables, and examples.",
};

export default function GrammatikPage() {
  const posts = getAllPosts();
  const featuredTopics = posts.slice(0, 4);

  return (
    <div className="container mx-auto max-w-5xl py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          German Grammar Theory
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-gray-600 sm:text-xl">
          Master German grammar step-by-step. Choose a topic below or search for
          specific concepts.
        </p>
      </div>

      <section
        aria-labelledby="featured-grammar-topics"
        className="mb-10 sm:mb-12"
      >
        <h2
          id="featured-grammar-topics"
          className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Popular learning paths
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTopics.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-700"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </section>

      <BlogList posts={posts} />
    </div>
  );
}
