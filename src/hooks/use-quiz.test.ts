import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "./use-quiz";

// Mock global fetch
global.fetch = jest.fn();

describe("useQuiz", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useQuiz());

    expect(result.current.selectedAnswer).toBe("");
    expect(result.current.feedback).toBeNull();
    expect(result.current.isChecking).toBe(false);
  });

  it("updates selected answer", () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.setSelectedAnswer("Option A");
    });

    expect(result.current.selectedAnswer).toBe("Option A");
  });

  it("checks answer successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Correct!" }),
    });

    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.setSelectedAnswer("Option A");
    });

    await act(async () => {
      await result.current.checkAnswer("lesson-1");
    });

    expect(result.current.feedback).toBe("Correct!");
    expect(result.current.isChecking).toBe(false);
  });

  it("handles check answer error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.setSelectedAnswer("Option A");
    });

    await act(async () => {
      await result.current.checkAnswer("lesson-1");
    });

    expect(result.current.feedback).toBe("Error checking answer.");

    consoleSpy.mockRestore();
  });

  it("resets quiz state", () => {
    const { result } = renderHook(() => useQuiz());

    act(() => {
      result.current.setSelectedAnswer("Option A");
    });

    act(() => {
      result.current.resetQuiz();
    });

    expect(result.current.selectedAnswer).toBe("");
    expect(result.current.feedback).toBeNull();
  });

  it("does not check answer when no answer is selected", async () => {
    const { result } = renderHook(() => useQuiz());

    await act(async () => {
      await result.current.checkAnswer("lesson-1");
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
