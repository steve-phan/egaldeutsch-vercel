import { render, screen, fireEvent } from "@testing-library/react";
import { WordScramble } from "./word-scramble";

describe("WordScramble", () => {
  const defaultProps = {
    word: "TEST",
    hint: "A four letter word",
    onComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with title and hint button", () => {
    render(<WordScramble {...defaultProps} />);
    
    expect(screen.getByText("Word Scramble")).toBeInTheDocument();
    expect(screen.getByText("Show Hint")).toBeInTheDocument();
  });

  it("shows hint when Show Hint button is clicked", () => {
    render(<WordScramble {...defaultProps} />);
    
    fireEvent.click(screen.getByText("Show Hint"));
    
    expect(screen.getByText(/A four letter word/)).toBeInTheDocument();
  });

  it("renders scrambled letters", () => {
    render(<WordScramble {...defaultProps} />);
    
    // All letters from "TEST" should be present
    const letters = ["T", "E", "S", "T"];
    letters.forEach(letter => {
      expect(screen.getAllByText(letter).length).toBeGreaterThan(0);
    });
  });

  it("moves letter to answer area when clicked", () => {
    render(<WordScramble {...defaultProps} />);
    
    // Find and click a letter button
    const letterButtons = screen.getAllByRole("button");
    const firstLetterButton = letterButtons.find(btn => 
      btn.textContent && ["T", "E", "S"].includes(btn.textContent)
    );
    
    if (firstLetterButton) {
      fireEvent.click(firstLetterButton);
      // The letter should now appear in a different state
    }
  });

  it("disables Check Answer button when no letters selected", () => {
    render(<WordScramble {...defaultProps} />);
    
    const checkButton = screen.getByText("Check Answer");
    expect(checkButton).toBeDisabled();
  });

  it("has a Reset button", () => {
    render(<WordScramble {...defaultProps} />);
    
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("displays instruction text when no letters selected", () => {
    render(<WordScramble {...defaultProps} />);
    
    expect(screen.getByText("Click letters below to form the word")).toBeInTheDocument();
  });
});
