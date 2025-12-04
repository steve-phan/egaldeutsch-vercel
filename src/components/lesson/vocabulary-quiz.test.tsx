import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VocabularyQuiz } from "./vocabulary-quiz";
import type { Vocabulary } from "@/types/vocabulary";

describe("VocabularyQuiz", () => {
  const mockVocabulary: Vocabulary = {
    id: "1",
    word: "Procrastinate",
    meaning: "To delay or postpone action",
    phonetic: "/prəˈkræstɪneɪt/",
    example_sentence: "I tend to procrastinate when faced with difficult tasks.",
    difficulty: "intermediate",
  };

  const mockOptions = [
    "To delay or postpone action",
    "To work hard continuously",
    "To finish quickly",
    "To celebrate success",
  ];

  const defaultProps = {
    vocabulary: mockVocabulary,
    options: mockOptions,
    quizType: "word-to-meaning" as const,
    onAnswer: jest.fn(),
    onNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the word prompt", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    expect(screen.getByText("Procrastinate")).toBeInTheDocument();
    expect(screen.getByText("/prəˈkræstɪneɪt/")).toBeInTheDocument();
  });

  it("renders all answer options", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    mockOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("allows selecting an answer", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    const correctOption = screen.getByLabelText("To delay or postpone action");
    fireEvent.click(correctOption);
    
    expect(correctOption).toBeChecked();
  });

  it("calls onAnswer with true for correct answer", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    // Select correct answer
    const correctOption = screen.getByLabelText("To delay or postpone action");
    fireEvent.click(correctOption);
    
    // Submit
    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    fireEvent.click(checkBtn);
    
    expect(defaultProps.onAnswer).toHaveBeenCalledWith(true);
  });

  it("calls onAnswer with false for incorrect answer", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    // Select incorrect answer
    const incorrectOption = screen.getByLabelText("To work hard continuously");
    fireEvent.click(incorrectOption);
    
    // Submit
    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    fireEvent.click(checkBtn);
    
    expect(defaultProps.onAnswer).toHaveBeenCalledWith(false);
  });

  it("shows feedback after answering correctly", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    // Select and submit correct answer
    const correctOption = screen.getByLabelText("To delay or postpone action");
    fireEvent.click(correctOption);
    
    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    fireEvent.click(checkBtn);
    
    expect(screen.getByText(/well done/i)).toBeInTheDocument();
  });

  it("shows hint when hint button is clicked", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    const hintBtn = screen.getByRole("button", { name: /show hint/i });
    fireEvent.click(hintBtn);
    
    expect(screen.getByText(mockVocabulary.example_sentence!)).toBeInTheDocument();
  });

  it("calls onNext when next button is clicked after answering", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    // Select and submit answer
    const correctOption = screen.getByLabelText("To delay or postpone action");
    fireEvent.click(correctOption);
    
    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    fireEvent.click(checkBtn);
    
    // Click next
    const nextBtn = screen.getByRole("button", { name: /next word/i });
    fireEvent.click(nextBtn);
    
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it("disables check button when no answer is selected", () => {
    render(<VocabularyQuiz {...defaultProps} />);
    
    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    expect(checkBtn).toBeDisabled();
  });
});
