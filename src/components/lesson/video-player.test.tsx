import { render, screen } from "@testing-library/react";
import { VideoPlayer } from "./video-player";

describe("VideoPlayer", () => {
  it("renders YouTube video as iframe", () => {
    const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    render(<VideoPlayer videoUrl={youtubeUrl} />);
    
    expect(screen.getByText("Video")).toBeInTheDocument();
    const iframe = screen.getByTitle("Lesson Video");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("renders direct video URL as video element", () => {
    const videoUrl = "https://example.com/video.mp4";
    render(<VideoPlayer videoUrl={videoUrl} />);
    
    expect(screen.getByText("Video")).toBeInTheDocument();
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", videoUrl);
  });

  it("handles YouTube short URLs", () => {
    const youtubeShortUrl = "https://youtu.be/dQw4w9WgXcQ";
    render(<VideoPlayer videoUrl={youtubeShortUrl} />);
    
    const iframe = screen.getByTitle("Lesson Video");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
});
