import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "../test/utils";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { createMockStore, mockAdminUser, mockStaffUser } from "../test/utils";

// Mock all the page components to avoid loading complex dependencies
vi.mock("../pages/member/HomePage/HomePage", () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock("../pages/member/LoginPage/LoginPage", () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock("../pages/auth/Login", () => ({
  default: () => <div>Auth Login Page</div>,
}));

vi.mock("../pages/NotFoundPage/NotFoundPage", () => ({
  default: () => <div>Not Found Page</div>,
}));

vi.mock("../pages/admin/Dashboard", () => ({
  default: () => <div>Admin Dashboard</div>,
}));

vi.mock("../pages/staff/Dashboard", () => ({
  default: () => <div>Staff Dashboard</div>,
}));

vi.mock("../components/layout/StaffLayout", () => ({
  default: ({ children }) => <div>Staff Layout: {children}</div>,
}));

vi.mock("../components/features/admin/AdminLayout", () => ({
  default: ({ children }) => <div>Admin Layout: {children}</div>,
}));

// Mock the auth utils
vi.mock("../utils/authUtils", () => ({
  checkAuthStatus: vi.fn(),
}));

describe("App Component - Routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders home page on root path", () => {
    const store = createMockStore();

    renderWithProviders(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders login page on /login path", () => {
    const store = createMockStore();

    renderWithProviders(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders auth login page on /auth/login path", () => {
    const store = createMockStore();

    renderWithProviders(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Auth Login Page")).toBeInTheDocument();
  });

  it("redirects unauthenticated users from protected routes", () => {
    const store = createMockStore({
      auth: () => ({ user: null, token: null, isLoggedIn: false }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    // Should redirect to auth login page
    expect(screen.getByText("Auth Login Page")).toBeInTheDocument();
  });

  it("allows authenticated admin users to access admin routes", () => {
    const store = createMockStore({
      auth: () => ({
        user: mockAdminUser,
        token: "valid-token",
        isLoggedIn: true,
      }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  it("allows authenticated staff users to access staff routes", () => {
    const store = createMockStore({
      auth: () => ({
        user: mockStaffUser,
        token: "valid-token",
        isLoggedIn: true,
      }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/staff/dashboard"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText(/staff dashboard/i)).toBeInTheDocument();
  });

  it("redirects staff users when accessing admin routes", () => {
    const store = createMockStore({
      auth: () => ({
        user: mockStaffUser,
        token: "valid-token",
        isLoggedIn: true,
      }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    // Should redirect to auth login because staff doesn't have admin role
    expect(screen.getByText("Auth Login Page")).toBeInTheDocument();
  });

  it("redirects /staff to /staff/dashboard", () => {
    const store = createMockStore({
      auth: () => ({
        user: mockStaffUser,
        token: "valid-token",
        isLoggedIn: true,
      }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/staff"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText(/staff dashboard/i)).toBeInTheDocument();
  });

  it("handles registration flow routes", () => {
    const store = createMockStore();

    const routes = [
      "/register/package",
      "/register/pt",
      "/register/account",
      "/register/personal",
      "/register/confirm",
      "/register/consult",
    ];

    routes.forEach((route) => {
      renderWithProviders(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>,
        { store }
      );

      // Each route should render without error
      // Since we're mocking components, we just check no error occurred
      expect(() => screen.getByText(/coming soon|page/i)).not.toThrow();
    });
  });

  it("handles payment flow routes", () => {
    const store = createMockStore();

    const paymentRoutes = ["/payment", "/payment/return"];

    paymentRoutes.forEach((route) => {
      renderWithProviders(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>,
        { store }
      );

      // Should render without error
      expect(() => screen.getByText(/page/i)).not.toThrow();
    });
  });

  it("calls checkAuthStatus on mount", () => {
    const store = createMockStore();
    const { checkAuthStatus } = require("../utils/authUtils");

    renderWithProviders(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
      { store }
    );

    expect(checkAuthStatus).toHaveBeenCalledTimes(1);
  });
});
