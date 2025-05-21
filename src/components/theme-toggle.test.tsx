import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "@/components/theme-provider";

// Mock the useTheme hook
vi.mock("@/components/theme-provider", () => ({
  useTheme: vi.fn(),
}));

describe("ThemeToggle", () => {
  const setThemeMock = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    setThemeMock.mockClear();
    // Setup the mock implementation for useTheme
    (useTheme as vi.Mock).mockReturnValue({ setTheme: setThemeMock });
  });

  it("renders without crashing", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('calls setTheme with "light" when Light menu item is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton); // Open the dropdown

    const lightMenuItem = screen.getByRole("menuitem", { name: /light/i });
    await user.click(lightMenuItem);

    expect(setThemeMock).toHaveBeenCalledWith("light");
  });

  it('calls setTheme with "dark" when Dark menu item is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton); // Open the dropdown

    const darkMenuItem = screen.getByRole("menuitem", { name: /dark/i });
    await user.click(darkMenuItem);

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it('calls setTheme with "system" when System menu item is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton); // Open the dropdown

    const systemMenuItem = screen.getByRole("menuitem", { name: /system/i });
    await user.click(systemMenuItem);

    expect(setThemeMock).toHaveBeenCalledWith("system");
  });
});
