import React from "react";
import { render, screen } from "@testing-library/react";
import { ProgressItem } from "./progress-item";

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("ProgressItem", () => {
  const defaultProgress = {
    id: "1",
    lesson_id: "lesson-1",
    lesson_title: "Test Lesson",
    completed: false,
    quiz_passed: false,
    attempts: 3,
  };

  it("renders lesson title", () => {
    render(<ProgressItem progress={defaultProgress} />);

    expect(screen.getByText("Test Lesson")).toBeInTheDocument();
  });

  it("renders attempt count", () => {
    render(<ProgressItem progress={defaultProgress} />);

    expect(screen.getByText("3 attempts")).toBeInTheDocument();
  });

  it("renders singular attempt for 1 attempt", () => {
    render(
      <ProgressItem progress={{ ...defaultProgress, attempts: 1 }} />
    );

    expect(screen.getByText("1 attempt")).toBeInTheDocument();
  });

  it("shows In Progress when not completed", () => {
    render(<ProgressItem progress={defaultProgress} />);

    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("shows Completed when completed", () => {
    render(
      <ProgressItem progress={{ ...defaultProgress, completed: true }} />
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows quiz status", () => {
    render(<ProgressItem progress={defaultProgress} />);

    expect(screen.getByText("Quiz: Not Passed")).toBeInTheDocument();
  });

  it("shows quiz passed when passed", () => {
    render(
      <ProgressItem progress={{ ...defaultProgress, quiz_passed: true }} />
    );

    expect(screen.getByText("Quiz: Passed")).toBeInTheDocument();
  });

  it("renders continue link", () => {
    render(<ProgressItem progress={defaultProgress} />);

    const link = screen.getByRole("link", { name: /continue/i });
    expect(link).toHaveAttribute("href", "/lesson/lesson-1");
  });

  it("fallbacks to lesson id when title is missing", () => {
    render(
      <ProgressItem
        progress={{ ...defaultProgress, lesson_title: undefined }}
      />
    );

    expect(screen.getByText("Lesson lesson-1")).toBeInTheDocument();
  });
});
