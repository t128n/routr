import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppFooter } from "./app-footer";

describe("AppFooter", () => {
  it("renders without crashing", () => {
    render(<AppFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("displays the copyright text", () => {
    render(<AppFooter />);
    expect(screen.getByText(/© 2025 Torben Haack/i)).toBeInTheDocument();
  });

  it("displays the GitHub link", () => {
    render(<AppFooter />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/t128n/routr");
  });

  it("displays the Docs link", () => {
    render(<AppFooter />);
    const docsLink = screen.getByRole("link", { name: /docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute("href", "https://github.com/t128n/routr#readme");
  });

  it("displays the mocked package version", () => {
    render(<AppFooter />);
    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
  });

  it("displays the mocked build time", () => {
    render(<AppFooter />);
    expect(screen.getByText("<2024-01-01T12:00:00.000Z>")).toBeInTheDocument();
  });
});
