import { render, screen, fireEvent } from "@testing-library/react";
import { TranscriptViewer } from "./transcript-viewer";

describe("TranscriptViewer", () => {
  const mockTranscript = [
    { text: "Hello, how are you?", translation: "A common greeting" },
    { text: "I'm fine, thank you.", translation: "A polite response" },
  ];

  it("renders transcript sentences", () => {
    render(<TranscriptViewer transcript={mockTranscript} />);
    
    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
    expect(screen.getByText("I'm fine, thank you.")).toBeInTheDocument();
  });

  it("shows translation on hover", () => {
    render(<TranscriptViewer transcript={mockTranscript} />);
    
    const firstSentence = screen.getByText("Hello, how are you?");
    
    // Translation should not be visible initially
    expect(screen.queryByText("A common greeting")).not.toBeInTheDocument();
    
    // Hover over the sentence
    fireEvent.mouseEnter(firstSentence.parentElement!);
    
    // Translation should now be visible
    expect(screen.getByText("A common greeting")).toBeInTheDocument();
    
    // Mouse leave
    fireEvent.mouseLeave(firstSentence.parentElement!);
    
    // Translation should be hidden again
    expect(screen.queryByText("A common greeting")).not.toBeInTheDocument();
  });

  it("toggles translation on click for mobile", () => {
    render(<TranscriptViewer transcript={mockTranscript} />);
    
    const firstSentence = screen.getByText("Hello, how are you?");
    
    // Click to show translation
    fireEvent.click(firstSentence.parentElement!);
    expect(screen.getByText("A common greeting")).toBeInTheDocument();
    
    // Click again to hide translation
    fireEvent.click(firstSentence.parentElement!);
    expect(screen.queryByText("A common greeting")).not.toBeInTheDocument();
  });
});
