import { render, screen } from "@testing-library/react";
import { LessonHeader } from "./lesson-header";

describe("LessonHeader", () => {
  it("renders title and description", () => {
    render(<LessonHeader title="Test Title" description="Test Description" />);
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders back button", () => {
    render(<LessonHeader title="Test Title" description="Test Description" />);
    
    expect(screen.getByText("Back to Lessons")).toBeInTheDocument();
  });
});
