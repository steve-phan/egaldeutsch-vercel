import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Flashcard } from "./flashcard";

// Mock Audio
const mockPlay = jest.fn().mockResolvedValue(undefined);
global.Audio = jest.fn().mockImplementation(() => ({
  play: mockPlay,
})) as unknown as typeof Audio;

describe("Flashcard", () => {
  const defaultProps = {
    word: "Procrastinate",
    meaning: "To delay or postpone action",
    phonetic: "/prəˈkræstɪneɪt/",
    exampleSentence: "I tend to procrastinate when faced with difficult tasks.",
    exampleTranslation: "面对困难任务时，我倾向于拖延。",
    onKnow: jest.fn(),
    onDontKnow: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the word on front side", () => {
    render(<Flashcard {...defaultProps} />);
    expect(screen.getByText("Procrastinate")).toBeInTheDocument();
    expect(screen.getByText("/prəˈkræstɪneɪt/")).toBeInTheDocument();
  });

  it("flips to show meaning when clicked", () => {
    render(<Flashcard {...defaultProps} />);
    
    const card = screen.getByRole("button", { name: /show meaning/i });
    fireEvent.click(card);
    
    expect(screen.getByText("To delay or postpone action")).toBeInTheDocument();
  });

  it("shows example sentence when toggled", () => {
    render(<Flashcard {...defaultProps} />);
    
    const showExampleBtn = screen.getByRole("button", { name: /show example/i });
    fireEvent.click(showExampleBtn);
    
    expect(screen.getByText(defaultProps.exampleSentence)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.exampleTranslation)).toBeInTheDocument();
  });

  it("calls onKnow when Know It button is clicked", () => {
    render(<Flashcard {...defaultProps} />);
    
    const knowBtn = screen.getByRole("button", { name: /know it/i });
    fireEvent.click(knowBtn);
    
    expect(defaultProps.onKnow).toHaveBeenCalledTimes(1);
  });

  it("calls onDontKnow when Don't Know button is clicked", () => {
    render(<Flashcard {...defaultProps} />);
    
    const dontKnowBtn = screen.getByRole("button", { name: /don't know/i });
    fireEvent.click(dontKnowBtn);
    
    expect(defaultProps.onDontKnow).toHaveBeenCalledTimes(1);
  });

  it("resets card when reset button is clicked", () => {
    render(<Flashcard {...defaultProps} />);
    
    // Flip the card first
    const card = screen.getByRole("button", { name: /show meaning/i });
    fireEvent.click(card);
    
    // Click reset
    const resetBtn = screen.getByRole("button", { name: /reset card/i });
    fireEvent.click(resetBtn);
    
    // Should show front side prompt again
    expect(screen.getByText(/tap card to reveal meaning/i)).toBeInTheDocument();
  });

  it("plays audio when listen button is clicked", () => {
    const audioUrl = "https://example.com/audio.mp3";
    render(<Flashcard {...defaultProps} audioUrl={audioUrl} />);
    
    const listenBtn = screen.getByRole("button", { name: /listen to pronunciation/i });
    fireEvent.click(listenBtn);
    
    expect(global.Audio).toHaveBeenCalledWith(audioUrl);
    expect(mockPlay).toHaveBeenCalled();
  });
});
