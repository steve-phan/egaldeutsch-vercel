import { renderHook, waitFor, act } from "@testing-library/react";
import React from "react";
import { useComments } from "./use-comments";

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

describe("useComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("test-token");
  });

  it("fetches comments on mount", async () => {
    const mockComments = [
      {
        id: "1",
        lesson_id: "lesson-1",
        user_id: "user-1",
        user_name: "John",
        content: "Great lesson!",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComments,
    });

    const { result } = renderHook(() => useComments("lesson-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.comments).toEqual(mockComments);
  });

  it("updates new comment text", () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useComments("lesson-1"));

    act(() => {
      result.current.setNewComment("My new comment");
    });

    expect(result.current.newComment).toBe("My new comment");
  });

  it("submits new comment", async () => {
    const existingComments = [
      {
        id: "1",
        lesson_id: "lesson-1",
        user_id: "user-1",
        user_name: "John",
        content: "First comment",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];
    const newComment = {
      id: "2",
      lesson_id: "lesson-1",
      user_id: "user-2",
      user_name: "Jane",
      content: "New comment",
      created_at: "2024-01-02T00:00:00Z",
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => existingComments,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => newComment,
      });

    const { result } = renderHook(() => useComments("lesson-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setNewComment("New comment");
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmitComment(mockEvent);
    });

    expect(result.current.comments).toHaveLength(2);
    expect(result.current.newComment).toBe("");
  });

  it("does not submit empty comment", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useComments("lesson-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmitComment(mockEvent);
    });

    // Should only have called fetch once for initial load
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
