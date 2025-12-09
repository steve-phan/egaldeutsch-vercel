"use client";

import { useState } from "react";
import { TranscriptSentence } from "@/types/lesson";

interface TranscriptViewerProps {
  transcript: TranscriptSentence[];
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="prose max-w-none">
      <h3 className="text-lg font-semibold mb-2">Transcript</h3>
      <div className="space-y-3">
        {transcript.map((sentence, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
          >
            <p className="text-slate-700 leading-relaxed cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
              {sentence.text}
            </p>
            {hoveredIndex === index && sentence.translation && (
              <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-slate-600 italic">
                {sentence.translation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
