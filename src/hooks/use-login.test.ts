import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useLogin } from "./use-login";

// Mock the auth context
const mockLogin = jest.fn();
jest.mock("@/components/auth-provider", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it("initializes with empty values", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  it("updates email and password", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail("test@example.com");
    });
    expect(result.current.email).toBe("test@example.com");

    act(() => {
      result.current.setPassword("password123");
    });
    expect(result.current.password).toBe("password123");
  });

  it("handles successful login", async () => {
    const mockUser = { id: "1", name: "Test", email: "test@example.com" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "test-token", user: mockUser }),
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith("test-token", mockUser);
    expect(result.current.error).toBe("");
  });

  it("handles login failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("wrong");
    });

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe("Invalid credentials");
  });

  it("handles network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useLogin());

    act(() => {
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
