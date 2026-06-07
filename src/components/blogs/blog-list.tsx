"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { MarkdownPost } from "@/lib/markdown";

interface BlogListProps {
  posts: Omit<MarkdownPost, "contentHtml">[];
}

const POSTS_PER_PAGE = 9;

export function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const query = searchQuery.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(query);
      const descriptionMatch = post.description.toLowerCase().includes(query);
      const categoryMatch = post.category.toLowerCase().includes(query);
      const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(query));

      return titleMatch || descriptionMatch || categoryMatch || tagsMatch;
    });
  }, [posts, searchQuery]);

  const currentPosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;

  // Reset pagination when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(POSTS_PER_PAGE);
  };

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMorePosts) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + POSTS_PER_PAGE, filteredPosts.length),
          );
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredPosts.length, hasMorePosts]);

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-8 max-w-xl sm:mb-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search grammar topics..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:rounded-2xl sm:py-4 sm:text-base"
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {currentPosts.map((post) => (
          <Link href={`/blogs/${post.slug}`} key={post.slug} className="group h-full">
            <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:rounded-2xl sm:p-6 sm:group-hover:-translate-y-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {post.level}
                </span>
                <span className="text-sm text-gray-500 font-medium">{post.category}</span>
              </div>
              
              <h2 className="mb-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                {post.title}
              </h2>
              
              <p className="mb-5 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600 sm:mb-6">
                {post.description}
              </p>
              
              <div className="mt-auto flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No results found</h3>
          <p className="text-gray-500">
            We could not find any posts matching &quot;{searchQuery}&quot;. Try a different term!
          </p>
        </div>
      )}

      {hasMorePosts && (
        <div ref={loadMoreRef} className="mt-10 flex justify-center sm:mt-12">
          <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 shadow-sm">
            Loading more topics…
          </span>
        </div>
      )}
    </div>
  );
}
