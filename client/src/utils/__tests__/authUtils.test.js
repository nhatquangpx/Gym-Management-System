import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { useAuth, formatUserForRedux, checkAuthStatus } from "../authUtils";
import { createMockStore } from "../../test/utils";

// Mock the Redux store and actions
vi.mock("../../redux/slices/authSlice", () => ({
  setLogin: vi.fn((payload) => ({ type: "auth/setLogin", payload })),
  setLogout: vi.fn(() => ({ type: "auth/setLogout" })),
}));

vi.mock("../../redux/store", () => ({
  store: {
    dispatch: vi.fn(),
  },
}));

describe("authUtils", () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    store = createMockStore();
    mockDispatch = vi.fn();
    store.dispatch = mockDispatch;

    // Mock the Redux store module
    const { store: reduxStore } = require("../../redux/store");
    reduxStore.dispatch.mockClear();
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  describe("useAuth hook", () => {
    it("should return initial auth state", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoggedIn).toBe(false);
      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });

    it("should handle login correctly", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      const userData = { id: 1, email: "test@example.com", role: "member" };
      const token = "test-token";

      act(() => {
        result.current.login(userData, token);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith("token", token);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(userData)
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "auth/setLogin",
        payload: { user: userData, token },
      });
    });

    it("should handle logout correctly", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(mockDispatch).toHaveBeenCalledWith({ type: "auth/setLogout" });
    });

    it("should work with authenticated user state", () => {
      const authenticatedStore = createMockStore({
        auth: () => ({
          user: { id: 1, email: "test@example.com" },
          token: "test-token",
          isLoggedIn: true,
        }),
      });

      const authenticatedWrapper = ({ children }) => (
        <Provider store={authenticatedStore}>{children}</Provider>
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: authenticatedWrapper,
      });

      expect(result.current.user).toEqual({ id: 1, email: "test@example.com" });
      expect(result.current.token).toBe("test-token");
      expect(result.current.isLoggedIn).toBe(true);
    });
  });

  describe("formatUserForRedux", () => {
    it("should return user with default role if none provided", () => {
      const user = { id: 1, email: "test@example.com" };
      const formatted = formatUserForRedux(user);

      expect(formatted).toEqual({
        id: 1,
        email: "test@example.com",
        role: "member",
      });
    });

    it("should preserve existing role", () => {
      const user = { id: 1, email: "test@example.com", role: "admin" };
      const formatted = formatUserForRedux(user);

      expect(formatted).toEqual({
        id: 1,
        email: "test@example.com",
        role: "admin",
      });
    });

    it("should preserve all user properties", () => {
      const user = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        role: "staff",
        additional: "data",
      };
      const formatted = formatUserForRedux(user);

      expect(formatted).toEqual(user);
    });
  });

  describe("checkAuthStatus", () => {
    it("should return true and dispatch login when valid token and user exist", () => {
      const user = { id: 1, email: "test@example.com", role: "member" };
      const token = "valid-token";

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const { store: reduxStore } = require("../../redux/store");
      const result = checkAuthStatus();

      expect(result).toBe(true);
      expect(reduxStore.dispatch).toHaveBeenCalledWith({
        type: "auth/setLogin",
        payload: { user, token },
      });
    });

    it("should return false when no token exists", () => {
      const result = checkAuthStatus();

      expect(result).toBe(false);

      const { store: reduxStore } = require("../../redux/store");
      expect(reduxStore.dispatch).not.toHaveBeenCalled();
    });

    it("should return false when no user exists", () => {
      localStorage.setItem("token", "valid-token");

      const result = checkAuthStatus();

      expect(result).toBe(false);

      const { store: reduxStore } = require("../../redux/store");
      expect(reduxStore.dispatch).not.toHaveBeenCalled();
    });

    it("should handle invalid JSON gracefully", () => {
      localStorage.setItem("token", "valid-token");
      localStorage.setItem("user", "invalid-json");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = checkAuthStatus();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Lỗi khi phân tích thông tin người dùng:",
        expect.any(Error)
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("user");

      consoleSpy.mockRestore();
    });

    it("should clean up invalid data when JSON parsing fails", () => {
      localStorage.setItem("token", "valid-token");
      localStorage.setItem("user", "{invalid json}");

      vi.spyOn(console, "error").mockImplementation(() => {});

      checkAuthStatus();

      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("user");
    });
  });
});
