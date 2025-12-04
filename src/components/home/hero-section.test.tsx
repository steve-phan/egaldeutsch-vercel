import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("renders heading", () => {
    render(<HeroSection />);

    expect(screen.getByText("Learn English Conversations")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<HeroSection />);

    expect(
      screen.getByText(/Improve your English speaking skills/i)
    ).toBeInTheDocument();
  });
});
