import { render, screen, fireEvent } from "@testing-library/react";
import { QuizSection } from "./quiz-section";

describe("QuizSection", () => {
  const defaultProps = {
    question: "Test Question?",
    options: ["Option A", "Option B", "Option C"],
    selectedAnswer: "",
    onSelectAnswer: jest.fn(),
    onCheckAnswer: jest.fn(),
    feedback: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders multiple choice quiz by default", () => {
    render(<QuizSection {...defaultProps} />);
    
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Test Question?")).toBeInTheDocument();
  });

  it("shows quiz type selector when multiple quiz types are available", () => {
    render(
      <QuizSection
        {...defaultProps}
        scrambleWord="TEST"
        scrambleHint="A hint"
        matchingPairs={[{ id: 1, word: "Word", match: "Match" }]}
      />
    );
    
    // Should show all three quiz type buttons
    expect(screen.getByRole("button", { name: /Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Scramble/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Match/i })).toBeInTheDocument();
  });

  it("switches to word scramble when Scramble button is clicked", () => {
    render(
      <QuizSection
        {...defaultProps}
        scrambleWord="TEST"
        scrambleHint="A hint"
      />
    );
    
    const scrambleButton = screen.getByRole("button", { name: /Scramble/i });
    fireEvent.click(scrambleButton);
    
    expect(screen.getByText("Word Scramble")).toBeInTheDocument();
  });

  it("switches to matching pairs when Match button is clicked", () => {
    render(
      <QuizSection
        {...defaultProps}
        matchingPairs={[
          { id: 1, word: "Word1", match: "Match1" },
          { id: 2, word: "Word2", match: "Match2" },
        ]}
      />
    );
    
    const matchButton = screen.getByRole("button", { name: /Match/i });
    fireEvent.click(matchButton);
    
    expect(screen.getByText("Matching Pairs")).toBeInTheDocument();
  });

  it("shows progress indicator when multiple quiz types available", () => {
    render(
      <QuizSection
        {...defaultProps}
        scrambleWord="TEST"
        scrambleHint="A hint"
      />
    );
    
    expect(screen.getByText(/Quiz Progress:/)).toBeInTheDocument();
  });

  it("does not show quiz type selector with only multiple choice", () => {
    render(<QuizSection {...defaultProps} />);
    
    // Should not have the scramble or match buttons
    expect(screen.queryByRole("button", { name: /Scramble/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Match/i })).not.toBeInTheDocument();
  });

  it("passes correct props to Quiz component", () => {
    render(<QuizSection {...defaultProps} />);
    
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });
});
