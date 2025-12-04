import React from "react";
import { render, screen } from "@testing-library/react";
import { LessonCard, LessonGrid } from "./lesson-grid";

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("LessonCard", () => {
  const mockLesson = {
    id: "1",
    title: "Test Lesson",
    description: "Test description",
  };

  it("renders lesson title and description", () => {
    render(<LessonCard lesson={mockLesson} />);

    expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders start lesson button with correct link", () => {
    render(<LessonCard lesson={mockLesson} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/lesson/1");
  });
});

describe("LessonGrid", () => {
  const mockLessons = [
    { id: "1", title: "Lesson 1", description: "Description 1" },
    { id: "2", title: "Lesson 2", description: "Description 2" },
  ];

  it("renders loading message when loading", () => {
    render(<LessonGrid lessons={[]} loading={true} />);

    expect(screen.getByText("Loading lessons...")).toBeInTheDocument();
  });

  it("renders no lessons message when empty", () => {
    render(<LessonGrid lessons={[]} loading={false} />);

    expect(screen.getByText("No lessons available.")).toBeInTheDocument();
  });

  it("renders all lessons", () => {
    render(<LessonGrid lessons={mockLessons} loading={false} />);

    expect(screen.getByText("Lesson 1")).toBeInTheDocument();
    expect(screen.getByText("Lesson 2")).toBeInTheDocument();
  });
});
