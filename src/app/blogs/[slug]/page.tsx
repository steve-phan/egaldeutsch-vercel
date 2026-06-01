import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs, getPostHtml, getAllPosts } from "@/lib/markdown";
import { getQuizGuideForBlogSlug } from "@/lib/blog-guide-links";
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

type PostSummary = ReturnType<typeof getAllPosts>[number];

function getRelatedPosts(post: PostSummary, allPosts: PostSummary[]) {
  return allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      const categoryScore = candidate.category === post.category ? 3 : 0;
      const levelScore = candidate.level === post.level ? 1 : 0;

      return {
        post: candidate,
        score: sharedTags + categoryScore + levelScore,
      };
    })
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.post.title.localeCompare(second.post.title);
    })
    .slice(0, 4)
    .map(({ post: relatedPost }) => relatedPost);
}

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
  const relatedPosts = getRelatedPosts(post, allPosts);
  const quizGuide = getQuizGuideForBlogSlug(post.slug);

  return (
    <article className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <Link 
          href="/blogs" 
          className="mb-6 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all topics
        </Link>
        
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
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

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        
        <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
          {post.description}
        </p>
      </div>

      <div 
        className="prose prose-blue max-w-none break-words sm:prose-lg
          prose-headings:font-bold prose-headings:not-italic prose-headings:tracking-tight
          prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl sm:prose-h2:text-3xl
          prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl sm:prose-h3:text-2xl
          prose-p:leading-relaxed prose-p:mb-6
          prose-a:break-words prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
          prose-li:mb-2
          prose-table:mb-8 prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-table:border-collapse sm:prose-table:table
          prose-th:border prose-th:border-gray-200 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
          prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2
          prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-gray-900"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {relatedPosts.length > 0 && (
        <section className="mt-14 border-t border-gray-200 pt-8 sm:mt-16" aria-labelledby="related-grammar-topics">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 id="related-grammar-topics" className="text-2xl font-bold tracking-tight text-gray-900">
                Related grammar topics
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Continue with lessons that connect naturally to {post.title}.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blogs/${relatedPost.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50"
              >
                <span className="mb-2 inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-600">
                  {relatedPost.category}
                </span>
                <h3 className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
                  {relatedPost.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                  {relatedPost.description}
                </p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600">
                  Read the guide <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* Post Navigator */}
      <div className="mt-12 border-t border-gray-200 pt-8 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link 
              href={`/blogs/${prevPost.slug}`}
              className="group flex flex-col items-start rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/50 sm:rounded-2xl"
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
              className="group flex flex-col items-start rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/50 sm:items-end sm:rounded-2xl sm:text-right"
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
        <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl bg-blue-50 p-5 sm:flex-row sm:items-center sm:rounded-2xl sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to practice?</h3>
            <p className="text-gray-600 text-sm">Test your knowledge with our interactive quizzes.</p>
          </div>
          <Link 
            href={quizGuide.href}
            className="inline-flex justify-center items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors w-full sm:w-auto"
          >
            {quizGuide.label}
          </Link>
        </div>
      </div>
    </article>
  );
}
