"use client";

import { useBlogPost } from "@/hooks/use-blog";
import { BlogContent } from "@/components/blog/blog-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { post, loading, error } = useBlogPost(slug);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading blog post...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error ? "Error" : "Not Found"}
          </h2>
          <p className="text-slate-600 mb-6">
            {error || "This blog post could not be found."}
          </p>
          <Link href="/blog">
            <Button>← Back to Blog</Button>
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-100 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="outline" className="mb-6">
              ← Back to Blog
            </Button>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-slate-700 mb-4">{post.description}</p>
          <div className="flex items-center gap-3 text-sm text-slate-600 mb-6">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-10">
          <BlogContent content={post.content} />
        </div>
      </article>

      {/* Footer Navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="border-t border-slate-200 pt-8">
          <Link href="/blog">
            <Button variant="outline" className="w-full md:w-auto">
              ← Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
