interface TranscriptViewerProps {
  transcript: string;
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  return (
    <div className="prose max-w-none">
      <h3 className="text-lg font-semibold mb-2">Transcript</h3>
      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{transcript}</p>
    </div>
  );
}
