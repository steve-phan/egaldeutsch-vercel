import React from "react";
import { render, screen } from "@testing-library/react";
import { FeatureCard } from "./feature-card";

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("FeatureCard", () => {
  const defaultProps = {
    href: "/quiz-demo",
    icon: "🎯",
    title: "Quiz Demo",
    description: "Try our interactive quiz types",
  };

  it("renders icon, title and description", () => {
    render(<FeatureCard {...defaultProps} />);

    expect(screen.getByText(/🎯/)).toBeInTheDocument();
    expect(screen.getByText(/Quiz Demo/)).toBeInTheDocument();
    expect(screen.getByText("Try our interactive quiz types")).toBeInTheDocument();
  });

  it("links to correct href", () => {
    render(<FeatureCard {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/quiz-demo");
  });

  it("applies custom className", () => {
    render(<FeatureCard {...defaultProps} className="border-orange-200" />);

    // Check that the card element contains the custom class
    const card = screen.getByRole("link").querySelector(".border-orange-200");
    expect(card).toBeInTheDocument();
  });
});
