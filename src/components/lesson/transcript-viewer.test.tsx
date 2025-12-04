import { render, screen } from "@testing-library/react";
import { TranscriptViewer } from "./transcript-viewer";

describe("TranscriptViewer", () => {
  it("renders transcript text", () => {
    const transcript = "This is a test transcript.";
    render(<TranscriptViewer transcript={transcript} />);
    
    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.getByText(transcript)).toBeInTheDocument();
  });
});
