import { render, screen, fireEvent } from "@testing-library/react";
import { AudioPlayer } from "./audio-player";

describe("AudioPlayer", () => {
  it("renders play button when not playing", () => {
    render(<AudioPlayer isPlaying={false} onTogglePlay={() => {}} disabled={false} />);
    // Lucide icons might not render text, so we check for the button
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls onTogglePlay when clicked", () => {
    const handleTogglePlay = jest.fn();
    render(<AudioPlayer isPlaying={false} onTogglePlay={handleTogglePlay} disabled={false} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(handleTogglePlay).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<AudioPlayer isPlaying={false} onTogglePlay={() => {}} disabled={true} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
