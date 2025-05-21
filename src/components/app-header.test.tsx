import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppHeader } from "./app-header";

// Mock the Settings component as it's complex and not the focus of this test
vi.mock("@/app/_settings", () => ({
  default: () => <button aria-label="Open settings">Mock Settings</button>,
}));

// Mock the ThemeToggle component
vi.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button aria-label="Toggle theme">Mock Theme Toggle</button>,
}));

describe("AppHeader", () => {
  it("renders without crashing", () => {
    render(<AppHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("displays the application title 'routr'", () => {
    render(<AppHeader />);
    expect(screen.getByText(/routr/i)).toBeInTheDocument();
  });

  it("renders the ThemeToggle component", () => {
    render(<AppHeader />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("renders the Settings component", () => {
    render(<AppHeader />);
    expect(screen.getByRole("button", { name: /open settings/i })).toBeInTheDocument();
  });
});
