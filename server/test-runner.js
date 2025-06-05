#!/usr/bin/env node

/**
 * Test Runner Script for Gym Management System
 * Sets up environment and runs Jest tests
 */

const { spawn } = require("child_process");
const path = require("path");

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-for-testing";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(colors[color] + message + colors.reset);
}

function runTests(args = []) {
  log("🧪 Starting Gym Management System Test Suite...", "blue");
  log("📁 Setting up test environment...", "yellow");

  const jestPath = path.join(__dirname, "node_modules", ".bin", "jest");
  const jestArgs = ["--detectOpenHandles", "--forceExit", "--verbose", ...args];

  const jest = spawn("npx", ["jest", ...jestArgs], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "test",
      JWT_SECRET: "test-jwt-secret-for-testing",
    },
  });

  jest.on("close", (code) => {
    if (code === 0) {
      log("✅ All tests passed!", "green");
    } else {
      log("❌ Some tests failed!", "red");
    }
    process.exit(code);
  });

  jest.on("error", (err) => {
    log("❌ Error running tests: " + err.message, "red");
    process.exit(1);
  });
}

// Parse command line arguments
const args = process.argv.slice(2);

// Handle different test commands
if (args.includes("--watch")) {
  log("👀 Running tests in watch mode...", "blue");
  runTests(["--watchAll"]);
} else if (args.includes("--coverage")) {
  log("📊 Running tests with coverage report...", "blue");
  runTests(["--coverage"]);
} else if (args.includes("--help")) {
  log("Gym Management System Test Runner", "blue");
  log("");
  log("Usage:");
  log("  node test-runner.js          Run all tests");
  log("  node test-runner.js --watch  Run tests in watch mode");
  log("  node test-runner.js --coverage  Run tests with coverage");
  log("  node test-runner.js <pattern>   Run specific test files");
  log("");
  log("Examples:");
  log("  node test-runner.js auth.test.js");
  log("  node test-runner.js users");
  log("  node test-runner.js integration/");
} else {
  runTests(args);
}
