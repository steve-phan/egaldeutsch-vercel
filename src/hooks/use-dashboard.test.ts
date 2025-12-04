import { renderHook, waitFor } from "@testing-library/react";
import { useDashboard } from "./use-dashboard";

// Mock the auth context
jest.mock("@/components/auth-provider", () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock global fetch
global.fetch = jest.fn();

describe("useDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("test-token");
  });

  it("initializes with loading state", () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useDashboard());

    expect(result.current.loading).toBe(true);
    expect(result.current.stats).toBeNull();
    expect(result.current.progress).toEqual([]);
  });

  it("fetches dashboard data successfully", async () => {
    const mockStats = {
      total_lessons: 10,
      completed_lessons: 5,
      quizzes_passed: 3,
      total_attempts: 8,
      completion_rate: 50,
    };
    const mockProgress = [
      {
        id: "1",
        lesson_id: "lesson-1",
        lesson_title: "Test Lesson",
        completed: true,
        quiz_passed: true,
        attempts: 2,
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProgress,
      });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.progress).toEqual(mockProgress);
  });

  it("handles fetch error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load dashboard data");

    consoleSpy.mockRestore();
  });
});
