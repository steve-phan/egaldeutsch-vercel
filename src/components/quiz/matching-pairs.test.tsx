import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MatchingPairs } from "./matching-pairs";

describe("MatchingPairs", () => {
  const defaultProps = {
    pairs: [
      { id: 1, word: "Hello", match: "Greeting" },
      { id: 2, word: "Goodbye", match: "Farewell" },
    ],
    onComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with title", () => {
    render(<MatchingPairs {...defaultProps} />);
    
    expect(screen.getByText("Matching Pairs")).toBeInTheDocument();
    expect(screen.getByText("Match each word with its correct pair by clicking on the cards")).toBeInTheDocument();
  });

  it("renders correct number of cards (2 per pair)", () => {
    render(<MatchingPairs {...defaultProps} />);
    
    // 2 pairs = 4 cards, each with a ? emoji initially
    const questionMarks = screen.getAllByText("❓");
    expect(questionMarks.length).toBe(4);
  });

  it("displays initial score counters", () => {
    render(<MatchingPairs {...defaultProps} />);
    
    expect(screen.getByText(/Matches:/)).toBeInTheDocument();
    expect(screen.getByText(/Attempts:/)).toBeInTheDocument();
    expect(screen.getByText("0/2")).toBeInTheDocument(); // matches
    expect(screen.getByText("0", { exact: true })).toBeInTheDocument(); // attempts
  });

  it("has a Play Again button", () => {
    render(<MatchingPairs {...defaultProps} />);
    
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("flips a card when clicked", async () => {
    render(<MatchingPairs {...defaultProps} />);
    
    const cards = screen.getAllByRole("button");
    const cardToClick = cards.find(card => card.textContent?.includes("❓"));
    
    if (cardToClick) {
      fireEvent.click(cardToClick);
      
      // After clicking, one of the cards should reveal its content
      await waitFor(() => {
        const content = ["Hello", "Greeting", "Goodbye", "Farewell"];
        const visibleContent = content.some(c => {
          try {
            return screen.getByText(c);
          } catch {
            return false;
          }
        });
        expect(visibleContent).toBe(true);
      });
    }
  });

  it("increments attempts after selecting two cards", async () => {
    render(<MatchingPairs {...defaultProps} />);
    
    const cards = screen.getAllByRole("button").filter(btn => btn.textContent?.includes("❓"));
    
    if (cards.length >= 2) {
      fireEvent.click(cards[0]);
      
      // Wait a bit then click second card
      await waitFor(() => {
        fireEvent.click(cards[1]);
      });
      
      // Wait for the attempt to be counted
      await waitFor(() => {
        expect(screen.getByText("1", { exact: true })).toBeInTheDocument();
      }, { timeout: 2000 });
    }
  });
});
