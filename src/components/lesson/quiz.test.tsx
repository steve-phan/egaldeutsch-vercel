import { render, screen, fireEvent } from "@testing-library/react";
import { Quiz } from "./quiz";

describe("Quiz", () => {
  const defaultProps = {
    question: "Test Question?",
    options: ["Option A", "Option B"],
    selectedAnswer: "",
    onSelectAnswer: jest.fn(),
    onCheckAnswer: jest.fn(),
    feedback: null,
  };

  it("renders question and options", () => {
    render(<Quiz {...defaultProps} />);
    
    expect(screen.getByText("Test Question?")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("calls onSelectAnswer when an option is selected", () => {
    render(<Quiz {...defaultProps} />);
    
    const optionA = screen.getByLabelText("Option A");
    fireEvent.click(optionA);
    
    expect(defaultProps.onSelectAnswer).toHaveBeenCalledWith("Option A");
  });

  it("calls onCheckAnswer when button is clicked", () => {
    render(<Quiz {...defaultProps} selectedAnswer="Option A" />);
    
    const button = screen.getByText("Check Answer");
    fireEvent.click(button);
    
    expect(defaultProps.onCheckAnswer).toHaveBeenCalledTimes(1);
  });

  it("displays feedback when provided", () => {
    render(<Quiz {...defaultProps} feedback="Correct!" />);
    
    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("disables check button when no answer is selected", () => {
    render(<Quiz {...defaultProps} selectedAnswer="" />);
    
    const button = screen.getByText("Check Answer");
    expect(button).toBeDisabled();
  });
});
