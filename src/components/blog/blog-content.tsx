"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import type { Components } from "react-markdown";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const components: Components = {
    // Custom heading rendering
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-slate-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-6 mb-3 text-slate-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-slate-900">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 text-slate-900">
        {children}
      </h4>
    ),
    // Custom paragraph rendering
    p: ({ children }) => (
      <p className="text-slate-700 leading-relaxed mb-4">{children}</p>
    ),
    // Custom list rendering
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-slate-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-700">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="ml-4">{children}</li>,
    // Custom code block rendering
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className="block bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => <pre className="mb-4">{children}</pre>,
    // Custom blockquote rendering
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-300 pl-4 italic my-4 text-slate-600">
        {children}
      </blockquote>
    ),
    // Custom link rendering
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    // Custom image rendering with Next.js Image
    img: ({ src, alt }) => {
      if (!src || typeof src !== 'string') return null;
      
      // Validate URL scheme to prevent XSS attacks
      const allowedSchemes = ['http:', 'https:', 'data:', '/'];
      const isValidUrl = allowedSchemes.some(scheme => src.startsWith(scheme));
      if (!isValidUrl) {
        console.warn(`Blocked potentially unsafe image URL: ${src}`);
        return null;
      }
      
      return (
        <div className="my-6 relative w-full h-64 md:h-96">
          <Image
            src={src}
            alt={alt || "Blog image"}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      );
    },
    // Custom horizontal rule
    hr: () => <hr className="my-8 border-slate-200" />,
    // Custom strong/bold rendering
    strong: ({ children }) => (
      <strong className="font-bold text-slate-900">{children}</strong>
    ),
    // Custom table rendering
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-slate-200">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-50">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white divide-y divide-slate-200">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        {children}
      </td>
    ),
  };

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
