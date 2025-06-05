import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "../../test/utils";
import AddButton from "../AddButton";

describe("AddButton Component", () => {
  it("renders with default label", () => {
    renderWithProviders(<AddButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Thêm mới")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    const customLabel = "Add New Item";
    renderWithProviders(<AddButton label={customLabel} />);

    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    renderWithProviders(<AddButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("displays add icon", () => {
    renderWithProviders(<AddButton />);

    // Check if the Add icon is present (Material-UI renders it as svg)
    const addIcon = document.querySelector('svg[data-testid="AddIcon"]');
    expect(addIcon || document.querySelector("svg")).toBeInTheDocument();
  });

  it("applies correct Material-UI variant and color", () => {
    renderWithProviders(<AddButton />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("MuiButton-contained");
    expect(button).toHaveClass("MuiButton-containedPrimary");
  });

  it("handles multiple clicks correctly", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    renderWithProviders(<AddButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it("works without onClick handler", () => {
    // Should not throw error when onClick is not provided
    expect(() => {
      renderWithProviders(<AddButton />);
    }).not.toThrow();
  });

  it("is accessible", () => {
    renderWithProviders(<AddButton label="Add new member" />);

    const button = screen.getByRole("button", { name: /add new member/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });
});
