interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  // YouTube video IDs are always 11 characters long
  const YOUTUBE_VIDEO_ID_LENGTH = 11;

  // Extract video ID from YouTube URL if it's a YouTube video
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === YOUTUBE_VIDEO_ID_LENGTH) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // If not a YouTube URL, assume it's a direct video URL
    return url;
  };

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : videoUrl;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Video</h3>
      <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden">
        {isYouTube ? (
          <iframe
            className="w-full h-full border-0"
            src={embedUrl}
            title="Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="w-full h-full"
            controls
            src={embedUrl}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
