// Additional test setup if needed
import "../test/setup.js";

// Configure testing library
import { configure } from "@testing-library/react";

configure({
  testIdAttribute: "data-testid",
  asyncUtilTimeout: 5000,
});

// Mock CSS modules
const mockCSSModules = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (typeof prop === "string") {
        return prop;
      }
      return undefined;
    },
  }
);

// Mock all CSS module imports
vi.mock("../**/*.module.css", () => mockCSSModules);
vi.mock("../**/*.css", () => ({}));
