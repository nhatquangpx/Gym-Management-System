import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a theme for Material-UI components
const theme = createTheme();

// Create a mock store with initial state
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (
        state = { user: null, token: null, isLoggedIn: false },
        action
      ) => {
        switch (action.type) {
          default:
            return state;
        }
      },
      ...initialState,
    },
  });
};

// Custom render function that includes providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Mock user data for testing
export const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  role: "member",
  fullName: "Test User",
};

export const mockAdminUser = {
  id: 2,
  username: "admin",
  email: "admin@example.com",
  role: "admin",
  fullName: "Admin User",
};

export const mockStaffUser = {
  id: 3,
  username: "staff",
  email: "staff@example.com",
  role: "employee",
  fullName: "Staff User",
};

export const mockTrainerUser = {
  id: 4,
  username: "trainer",
  email: "trainer@example.com",
  role: "trainer",
  fullName: "Trainer User",
};

// Mock API responses
export const mockApiResponse = {
  success: true,
  data: [],
  message: "Success",
};

export const mockApiError = {
  success: false,
  message: "Something went wrong",
  error: "Internal Server Error",
};

// Custom matcher for async testing
export const waitForElementToBeRemoved = async (element) => {
  const { waitForElementToBeRemoved: originalWait } = await import(
    "@testing-library/react"
  );
  return originalWait(element);
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
