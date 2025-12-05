import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./navbar";

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock the auth context
const mockLogout = jest.fn();
let mockAuthState = {
  user: null as { name: string } | null,
  isAuthenticated: false,
  logout: mockLogout,
};

jest.mock("@/components/auth-provider", () => ({
  useAuth: () => mockAuthState,
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders brand name", () => {
    render(<Navbar />);

    expect(screen.getByText("EgalDeutsch")).toBeInTheDocument();
  });

  it("shows login and signup buttons when not authenticated", () => {
    mockAuthState = {
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
    };

    render(<Navbar />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("shows user greeting and nav links when authenticated", () => {
    mockAuthState = {
      user: { name: "John" },
      isAuthenticated: true,
      logout: mockLogout,
    };

    render(<Navbar />);

    expect(screen.getByText("Hello, John")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    mockAuthState = {
      user: { name: "John" },
      isAuthenticated: true,
      logout: mockLogout,
    };

    render(<Navbar />);

    fireEvent.click(screen.getByText("Logout"));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
