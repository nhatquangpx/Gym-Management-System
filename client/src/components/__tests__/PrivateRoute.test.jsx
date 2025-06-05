import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  renderWithProviders,
  screen,
  mockUser,
  mockAdminUser,
} from "../../test/utils";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { createMockStore } from "../../test/utils";

// Mock components for testing
const ProtectedComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe("PrivateRoute Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("redirects to login when user is not authenticated", () => {
    const store = createMockStore({
      auth: () => ({ user: null, token: null, isLoggedIn: false }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("allows access when user is authenticated via Redux store", () => {
    const store = createMockStore({
      auth: () => ({ user: mockUser, token: "valid-token", isLoggedIn: true }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("allows access when user is authenticated via localStorage", () => {
    // Mock localStorage
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    const store = createMockStore({
      auth: () => ({ user: null, token: null, isLoggedIn: false }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("allows access when user has required role", () => {
    const store = createMockStore({
      auth: () => ({
        user: mockAdminUser,
        token: "valid-token",
        isLoggedIn: true,
      }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when user does not have required role", () => {
    const store = createMockStore({
      auth: () => ({ user: mockUser, token: "valid-token", isLoggedIn: true }), // member role
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("allows access when user has one of multiple allowed roles", () => {
    const store = createMockStore({
      auth: () => ({ user: mockUser, token: "valid-token", isLoggedIn: true }), // member role
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route
            element={
              <PrivateRoute allowedRoles={["admin", "member", "employee"]} />
            }
          >
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("user", "invalid-json");

    const store = createMockStore({
      auth: () => ({ user: null, token: null, isLoggedIn: false }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("works with employee role access", () => {
    const employeeUser = { ...mockUser, role: "employee" };
    const store = createMockStore({
      auth: () => ({
        user: employeeUser,
        token: "valid-token",
        isLoggedIn: true,
      }),
    });

    renderWithProviders(
      <MemoryRouter initialEntries={["/staff"]}>
        <Routes>
          <Route path="/auth/login" element={<LoginComponent />} />
          <Route element={<PrivateRoute allowedRoles={["employee"]} />}>
            <Route path="/staff" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { store }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
