import { renderHook, waitFor } from "@testing-library/react";
import { useLessons } from "./use-lessons";

// Mock global fetch
global.fetch = jest.fn();

describe("useLessons", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("initializes with loading state", () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useLessons());

    expect(result.current.loading).toBe(true);
    expect(result.current.lessons).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetches lessons successfully", async () => {
    const mockLessons = [
      { id: "1", title: "Lesson 1", description: "Description 1" },
      { id: "2", title: "Lesson 2", description: "Description 2" },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLessons,
    });

    const { result } = renderHook(() => useLessons());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lessons).toEqual(mockLessons);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useLessons());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load lessons");
    expect(result.current.lessons).toEqual([]);

    consoleSpy.mockRestore();
  });
});
