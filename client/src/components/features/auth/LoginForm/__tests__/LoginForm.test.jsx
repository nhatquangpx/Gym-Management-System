import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "../../../../../test/utils";
import LoginForm from "../LoginForm";
import { createMockStore } from "../../../../../test/utils";

// Mock the auth slice
vi.mock("../../../../../redux/slices/authSlice", () => ({
  setLogin: vi.fn((payload) => ({ type: "auth/setLogin", payload })),
}));

// Mock the components that may not be easily testable
vi.mock("../../../../common/InputField/InputField", () => ({
  default: ({
    id,
    name,
    label,
    type,
    placeholder,
    value,
    onChange,
    error,
    required,
  }) => (
    <div>
      <label htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <div id={`${id}-error`} role="alert">
          {error}
        </div>
      )}
    </div>
  ),
}));

vi.mock("../../../../common/PasswordField/PasswordField", () => ({
  default: ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    required,
  }) => (
    <div>
      <label htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        name={name}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <div id={`${id}-error`} role="alert">
          {error}
        </div>
      )}
    </div>
  ),
}));

vi.mock("../../../../common/Button/Button", () => ({
  default: ({ children, type, disabled, ...props }) => (
    <button type={type} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("LoginForm Component", () => {
  let mockNavigate;
  let store;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    fetch.mockClear();

    // Mock useNavigate
    mockNavigate = vi.fn();
    vi.doMock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ to, children, ...props }) => (
          <a href={to} {...props}>
            {children}
          </a>
        ),
      };
    });

    // Create a fresh store for each test
    store = createMockStore();
  });

  it("renders login form with all fields", () => {
    renderWithProviders(<LoginForm />, { store });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /đăng nhập/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/quên mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByText(/đăng ký ngay/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />, { store });

    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
    await user.click(submitButton);

    expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
    expect(screen.getByText(/mật khẩu là bắt buộc/i)).toBeInTheDocument();
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument();
  });

  it("clears errors when user starts typing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    // Trigger validation error
    await user.click(submitButton);
    expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();

    // Type in email field
    await user.type(emailInput, "test@example.com");
    expect(screen.queryByText(/email là bắt buộc/i)).not.toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          user: { id: 1, email: "test@example.com", role: "member" },
          token: "mock-token",
        }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      })
    );
  });

  it("displays error message on login failure", async () => {
    const user = userEvent.setup();

    // Mock failed API response
    const mockResponse = {
      ok: false,
      json: () =>
        Promise.resolve({
          message: "Invalid credentials",
        }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();

    // Mock delayed API response
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          user: { id: 1, email: "test@example.com", role: "member" },
          token: "mock-token",
        }),
    };
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(screen.getByText(/đang đăng nhập/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("saves token to localStorage when remember me is checked", async () => {
    const user = userEvent.setup();

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          user: { id: 1, email: "test@example.com", role: "member" },
          token: "mock-token",
        }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "mock-token");
    });
  });

  it("handles network errors gracefully", async () => {
    const user = userEvent.setup();

    // Mock network error
    fetch.mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/đăng nhập thất bại/i)).toBeInTheDocument();
    });
  });

  it("navigates to home page after successful login", async () => {
    const user = userEvent.setup();

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          user: { id: 1, email: "test@example.com", role: "member" },
          token: "mock-token",
        }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<LoginForm />, { store });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /đăng nhập/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
