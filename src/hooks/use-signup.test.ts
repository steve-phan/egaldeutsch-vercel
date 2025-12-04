import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useSignup } from "./use-signup";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("useSignup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it("initializes with empty values", () => {
    const { result } = renderHook(() => useSignup());

    expect(result.current.name).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  it("updates name, email and password", () => {
    const { result } = renderHook(() => useSignup());

    act(() => {
      result.current.setName("John Doe");
    });
    expect(result.current.name).toBe("John Doe");

    act(() => {
      result.current.setEmail("test@example.com");
    });
    expect(result.current.email).toBe("test@example.com");

    act(() => {
      result.current.setPassword("password123");
    });
    expect(result.current.password).toBe("password123");
  });

  it("handles successful signup", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User created" }),
    });

    const { result } = renderHook(() => useSignup());

    act(() => {
      result.current.setName("John Doe");
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(result.current.error).toBe("");
  });

  it("handles signup failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already exists" }),
    });

    const { result } = renderHook(() => useSignup());

    act(() => {
      result.current.setName("John Doe");
      result.current.setEmail("existing@example.com");
      result.current.setPassword("password123");
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe("Email already exists");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSignup());

    act(() => {
      result.current.setName("John Doe");
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe("Network error");
  });
});
