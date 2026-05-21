import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import { BlogList } from "@/components/blogs/blog-list";

export const metadata = {
  title: "German Grammar Theory | Egaldeutsch",
  description: "Learn German grammar easily with clear explanations, tables, and examples.",
};

export default function GrammatikPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">German Grammar Theory</h1>
        <p className="text-xl text-gray-600">
          Master German grammar step-by-step. Choose a topic below or search for specific concepts.
        </p>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
