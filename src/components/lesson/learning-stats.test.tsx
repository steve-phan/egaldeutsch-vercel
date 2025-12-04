import React from "react";
import { render, screen } from "@testing-library/react";
import { LearningStats } from "./learning-stats";
import type { UserLearningStats } from "@/types/vocabulary";

describe("LearningStats", () => {
  const defaultStats: UserLearningStats = {
    total_words_learned: 127,
    total_words_mastered: 45,
    words_due_for_review: 12,
    daily_goal: {
      target_words: 10,
      words_learned: 6,
      target_reviews: 20,
      words_reviewed: 15,
      date: "2024-01-15",
    },
    streak: {
      current_streak: 7,
      longest_streak: 14,
      last_active_date: "2024-01-15",
      streak_dates: [],
    },
  };

  it("renders streak information", () => {
    render(<LearningStats stats={defaultStats} />);
    
    expect(screen.getByText("7 days")).toBeInTheDocument();
    expect(screen.getByText("14 days")).toBeInTheDocument();
    expect(screen.getByText("Learning Streak")).toBeInTheDocument();
  });

  it("renders daily goal progress", () => {
    render(<LearningStats stats={defaultStats} />);
    
    expect(screen.getByText("Today's Goals")).toBeInTheDocument();
    expect(screen.getByText("6 / 10")).toBeInTheDocument();
    expect(screen.getByText("15 / 20")).toBeInTheDocument();
  });

  it("renders overall stats cards", () => {
    render(<LearningStats stats={defaultStats} />);
    
    expect(screen.getByText("127")).toBeInTheDocument();
    expect(screen.getByText("Words Learned")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Mastered")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Due Review")).toBeInTheDocument();
  });

  it("shows completion message when daily goals are met", () => {
    const completedStats: UserLearningStats = {
      ...defaultStats,
      daily_goal: {
        ...defaultStats.daily_goal,
        words_learned: 10,
        words_reviewed: 20,
      },
    };
    
    render(<LearningStats stats={completedStats} />);
    
    expect(screen.getByText(/daily goals completed/i)).toBeInTheDocument();
  });

  it("does not show completion message when goals are not met", () => {
    render(<LearningStats stats={defaultStats} />);
    
    expect(screen.queryByText(/daily goals completed/i)).not.toBeInTheDocument();
  });
});
