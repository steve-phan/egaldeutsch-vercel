import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs, getPostHtml, getAllPosts } from "@/lib/markdown";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} | Egaldeutsch Grammatik`,
    description: post.description,
  };
}

export default async function GrammatikPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  const allPosts = getAllPosts();

  if (!post) {
    return notFound();
  }

  const contentHtml = await getPostHtml(post.contentHtml);
  
  // Find current post index for next/prev navigation
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null; // Newer posts are first in array
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <Link 
          href="/blogs" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all topics
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {post.level}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {post.category}
          </span>
          <span className="text-sm text-gray-400">•</span>
          <time className="text-sm text-gray-500" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          {post.description}
        </p>
      </div>

      <div 
        className="prose prose-lg prose-blue max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-3xl
          prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl
          prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
          prose-li:mb-2
          prose-table:w-full prose-table:border-collapse prose-table:mb-8
          prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
          prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2
          prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-gray-900"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      
      {/* Post Navigator */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link 
              href={`/blogs/${prevPost.slug}`}
              className="group flex flex-col items-start p-4 rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
            >
              <span className="text-xs font-semibold text-gray-500 mb-1 flex items-center">
                <ChevronLeft className="w-3 h-3 mr-1" /> Previous Topic
              </span>
              <span className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                {prevPost.title}
              </span>
            </Link>
          ) : <div />}
          
          {nextPost ? (
            <Link 
              href={`/blogs/${nextPost.slug}`}
              className="group flex flex-col items-end p-4 rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-right"
            >
              <span className="text-xs font-semibold text-gray-500 mb-1 flex items-center">
                Next Topic <ChevronRight className="w-3 h-3 ml-1" />
              </span>
              <span className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                {nextPost.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 rounded-2xl p-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to practice?</h3>
            <p className="text-gray-600 text-sm">Test your knowledge with our interactive quizzes.</p>
          </div>
          <Link 
            href="/practice" 
            className="inline-flex justify-center items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors w-full sm:w-auto"
          >
            Start Practice Quiz
          </Link>
        </div>
      </div>
    </article>
  );
}
