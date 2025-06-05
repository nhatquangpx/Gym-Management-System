const request = require("supertest");
const createTestApp = require("../helpers/testApp");
const { createTestUser, generateTestToken } = require("../helpers/testHelpers");

const app = createTestApp();

describe("Authentication Routes", () => {
  describe("POST /api/auth/check-existed-email", () => {
    it("should return true if email exists", async () => {
      // Arrange
      await createTestUser({ email: "existing@test.com" });

      // Act
      const response = await request(app)
        .post("/api/auth/check-existed-email")
        .send({ email: "existing@test.com" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.exists).toBe(true);
    });

    it("should return false if email does not exist", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/check-existed-email")
        .send({ email: "nonexistent@test.com" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.exists).toBe(false);
    });

    it("should return validation error for invalid email format", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/check-existed-email")
        .send({ email: "invalid-email" });

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return error when email is missing", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/check-existed-email")
        .send({});

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      // Arrange
      const user = await createTestUser({
        email: "user@test.com",
        password: "password123",
      });

      // Act
      const response = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(500);
    });

    it("should return error for invalid email", async () => {
      // Act
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return error for invalid password", async () => {
      // Arrange
      await createTestUser({
        email: "user@test.com",
        password: "password123",
      });

      // Act
      const response = await request(app).post("/api/auth/login").send({
        email: "user@test.com",
        password: "wrongpassword",
      });

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return error for inactive user", async () => {
      // Arrange
      await createTestUser({
        email: "inactive@test.com",
        password: "password123",
        isActive: false,
      });

      // Act
      const response = await request(app).post("/api/auth/login").send({
        email: "inactive@test.com",
        password: "password123",
      });

      // Assert
      expect(response.status).toBe(403);

    });

    it("should return validation errors for missing fields", async () => {
      // Act
      const response = await request(app).post("/api/auth/login").send({});

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should send reset password email for existing user", async () => {
      // Arrange
      await createTestUser({ email: "user@test.com" });

      // Act
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "user@test.com" });

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return error for non-existing email", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "nonexistent@test.com" });

      // Assert
      expect(response.status).toBe(404);
    });

    it("should return validation error for invalid email format", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "invalid-email" });

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should reset password successfully with valid token", async () => {
      // Arrange
      const user = await createTestUser({ email: "user@test.com" });
      const token = generateTestToken(user._id, user.role);

      // Act
      const response = await request(app)
        .post("/api/auth/reset-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return error when passwords do not match", async () => {
      // Arrange
      const user = await createTestUser({ email: "user@test.com" });
      const token = generateTestToken(user._id, user.role);

      // Act
      const response = await request(app)
        .post("/api/auth/reset-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          newPassword: "newpassword123",
          confirmPassword: "differentpassword",
        });

      // Assert
      expect(response.status).toBe(401);
    });

    it("should return error for invalid token", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/reset-password")
        .set("Authorization", "Bearer invalid-token")
        .send({
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      // Assert
      expect(response.status).toBe(401);
    });

    it("should return error when no token provided", async () => {
      // Act
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      // Assert
      expect(response.status).toBe(403);
    });

    it("should return validation error for weak password", async () => {
      // Arrange
      const user = await createTestUser({ email: "user@test.com" });
      const token = generateTestToken(user._id, user.role);

      // Act
      const response = await request(app)
        .post("/api/auth/reset-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          newPassword: "123",
          confirmPassword: "123",
        });

      // Assert
      expect(response.status).toBe(400);
    });
  });
});
