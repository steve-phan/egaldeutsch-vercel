"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { MarkdownPost } from "@/lib/markdown";

interface BlogListProps {
  posts: Omit<MarkdownPost, "contentHtml">[];
}

const POSTS_PER_PAGE = 9;

export function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

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

  // The posts to actually render on screen
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Reset pagination when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="relative max-w-xl mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by topic, keyword, or level (e.g., 'Akkusativ', 'Cases', 'A2')..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all text-sm sm:text-base"
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => (
          <Link href={`/blogs/${post.slug}`} key={post.slug} className="group h-full">
            <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group-hover:-translate-y-1">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {post.level}
                </span>
                <span className="text-sm text-gray-500 font-medium">{post.category}</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                {post.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
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
            We couldn't find any posts matching "{searchQuery}". Try a different term!
          </p>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredPosts.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm active:scale-95"
          >
            Load More <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
