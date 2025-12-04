import { renderHook, waitFor } from "@testing-library/react";
import { useLesson } from "./use-lesson";

// Mock global fetch
global.fetch = jest.fn();

describe("useLesson", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("fetches lesson successfully", async () => {
    const mockLesson = {
      id: "1",
      title: "Test Lesson",
      description: "Test Description",
      audio_url: "http://example.com/audio.mp3",
      transcript: "Test Transcript",
      quiz_question: "Test Question?",
      quiz_options: ["A", "B"],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLesson,
    });

    const { result } = renderHook(() => useLesson("1"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lesson).toEqual(mockLesson);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useLesson("1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lesson).toBeNull();
    expect(result.current.error).toBe("Failed to load lesson");
  });
});
