# Frontend Testing Guide

This document provides a comprehensive guide for testing the React frontend of the Gym Management System.

## Testing Stack

- **Vitest**: Fast unit test framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom DOM matchers
- **jsdom**: DOM environment for testing

## Project Structure

```
client/src/
├── test/
│   ├── setup.js          # Global test setup
│   ├── utils.jsx         # Testing utilities and helpers
│   └── README.md         # This file
├── components/
│   └── __tests__/        # Component tests
├── pages/
│   └── __tests__/        # Page tests
├── utils/
│   └── __tests__/        # Utility function tests
└── __tests__/           # Integration tests
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test run

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Patterns

- `**/*.test.{js,jsx,ts,tsx}` - Test files
- `**/__tests__/**/*.{js,jsx,ts,tsx}` - Test files in **tests** folders

## Writing Tests

### Basic Component Test

```jsx
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test/utils";
import MyComponent from "../MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

### Testing with User Interactions

```jsx
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "../../test/utils";
import MyForm from "../MyForm";

describe("MyForm", () => {
  it("handles form submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyForm />);

    const input = screen.getByLabelText(/email/i);
    const button = screen.getByRole("button", { name: /submit/i });

    await user.type(input, "test@example.com");
    await user.click(button);

    expect(screen.getByText("Form submitted")).toBeInTheDocument();
  });
});
```

### Testing with Redux State

```jsx
import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "../../test/utils";
import { createMockStore } from "../../test/utils";
import MyComponent from "../MyComponent";

describe("MyComponent with Redux", () => {
  it("displays user data from store", () => {
    const store = createMockStore({
      auth: () => ({
        user: { name: "John Doe" },
        isLoggedIn: true,
      }),
    });

    renderWithProviders(<MyComponent />, { store });
    expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
  });
});
```

### Testing API Calls

```jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { mockApiResponse } from "../../test/utils";

// Mock fetch or axios
global.fetch = vi.fn();

describe("API Integration", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("fetches data successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    // Your test logic here
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/endpoint");
    });
  });
});
```

## Testing Utilities

### `renderWithProviders`

Renders components with all necessary providers (Redux, Router, Theme).

```jsx
renderWithProviders(<Component />, {
  store: customStore, // Optional custom store
  preloadedState: {}, // Optional initial state
  // ...other render options
});
```

### `createMockStore`

Creates a mock Redux store with customizable reducers.

```jsx
const store = createMockStore({
  auth: () => ({ user: mockUser, isLoggedIn: true }),
  // other reducers...
});
```

### Mock Data

Pre-defined mock data is available in `test/utils.jsx`:

- `mockUser`: Basic user object
- `mockAdminUser`: Admin user object
- `mockStaffUser`: Staff user object
- `mockTrainerUser`: Trainer user object
- `mockApiResponse`: Successful API response
- `mockApiError`: Error API response

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Testing internal state or methods

```jsx
expect(component.state.isLoading).toBe(false);
```

✅ **Good**: Testing user-visible behavior

```jsx
expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
```

### 2. Use Accessible Queries

❌ **Bad**: Using querySelector

```jsx
const button = container.querySelector(".submit-button");
```

✅ **Good**: Using accessible queries

```jsx
const button = screen.getByRole("button", { name: /submit/i });
```

### 3. Clean Up After Tests

```jsx
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup(); // Automatically done by @testing-library/react
});
```

### 4. Test Error States

```jsx
it("displays error message when API fails", async () => {
  fetch.mockRejectedValueOnce(new Error("API Error"));

  renderWithProviders(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

### 5. Use Mock Functions for Event Handlers

```jsx
it("calls onClick when button is clicked", async () => {
  const mockOnClick = vi.fn();
  const user = userEvent.setup();

  renderWithProviders(<Button onClick={mockOnClick} />);

  await user.click(screen.getByRole("button"));
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
```

## Common Testing Patterns

### Testing Forms

```jsx
describe("LoginForm", () => {
  it("validates required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });
});
```

### Testing Routing

```jsx
import { MemoryRouter } from "react-router-dom";

describe("App Routing", () => {
  it("renders home page on root path", () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
```

### Testing Loading States

```jsx
describe("DataComponent", () => {
  it("shows loading state while fetching data", () => {
    renderWithProviders(<DataComponent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows data after loading", async () => {
    renderWithProviders(<DataComponent />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Data loaded")).toBeInTheDocument();
  });
});
```

## Debugging Tests

### Using screen.debug()

```jsx
it("debug test", () => {
  renderWithProviders(<MyComponent />);
  screen.debug(); // Prints current DOM to console
});
```

### Finding Elements

```jsx
// Find all elements matching a pattern
screen.debug(screen.getAllByText(/button/i));

// Find element by role with options
screen.debug(screen.getByRole("button", { name: /submit/i }));
```

### Common Queries

- `getByText()` - Find by text content
- `getByRole()` - Find by ARIA role
- `getByLabelText()` - Find by associated label
- `getByPlaceholderText()` - Find by placeholder
- `getByTestId()` - Find by data-testid attribute

Use `queryBy*` for elements that might not exist.
Use `findBy*` for elements that appear asynchronously.

## Coverage Reports

Coverage reports show which parts of your code are tested:

```bash
npm run test:coverage
```

The report includes:

- **Statements**: Percentage of statements executed
- **Branches**: Percentage of branches taken
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

Aim for high coverage, but remember that 100% coverage doesn't guarantee bug-free code.

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in test config
2. **Module not found**: Check import paths and mocks
3. **Async issues**: Use `waitFor()` or `findBy*` queries
4. **Redux state issues**: Ensure proper store setup

### Environment Issues

- Ensure Node.js version compatibility
- Clear npm cache if needed: `npm cache clean --force`
- Check that all dependencies are installed

For more help, check the official documentation:

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
