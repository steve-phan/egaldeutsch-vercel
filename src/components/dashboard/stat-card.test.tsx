import React from "react";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("renders title and value", () => {
    render(<StatCard title="Total Lessons" value={10} />);

    expect(screen.getByText("Total Lessons")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <StatCard
        title="Progress"
        value="50%"
        description="Half way there!"
      />
    );

    expect(screen.getByText("Half way there!")).toBeInTheDocument();
  });

  it("applies custom value class name", () => {
    render(
      <StatCard
        title="Success"
        value={100}
        className="text-green-600"
      />
    );

    const valueElement = screen.getByText("100");
    expect(valueElement).toHaveClass("text-green-600");
  });

  it("renders string values", () => {
    render(<StatCard title="Rate" value="75%" />);

    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
