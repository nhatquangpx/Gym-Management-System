import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "../../../../test/utils";
import LoginPage from "../LoginPage";

// Mock the LoginForm component
vi.mock("../../../../components/features/auth/LoginForm/LoginForm", () => ({
  default: () => <div data-testid="login-form">Mock Login Form</div>,
}));

describe("LoginPage Component", () => {
  it("renders the page with correct structure", () => {
    renderWithProviders(<LoginPage />);

    // Check for main container
    expect(document.querySelector(".container")).toBeInTheDocument();
    expect(document.querySelector(".loginContainer")).toBeInTheDocument();
  });

  it("displays the gym brand name", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("GymPro")).toBeInTheDocument();
  });

  it("displays the welcome message", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("Chào mừng bạn quay trở lại")).toBeInTheDocument();
  });

  it("renders the LoginForm component", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("has proper heading hierarchy", () => {
    renderWithProviders(<LoginPage />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("GymPro");
  });

  it("applies correct CSS classes", () => {
    renderWithProviders(<LoginPage />);

    expect(document.querySelector(".container")).toBeInTheDocument();
    expect(document.querySelector(".loginContainer")).toBeInTheDocument();
    expect(document.querySelector(".loginHeader")).toBeInTheDocument();
  });
});
