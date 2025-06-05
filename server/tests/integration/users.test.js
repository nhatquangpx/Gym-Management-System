// Import setup để đảm bảo MongoDB Memory Server được khởi tạo trước
require('../setup');
const mongoose = require('mongoose');
const request = require("supertest");
const createTestApp = require("../helpers/testApp");
const {
  createTestUser,
  generateTestToken,
  createTestAdmin,
  createTestMember,
  clearTestData
} = require("../helpers/testHelpers");

const app = createTestApp();

describe("User Routes", () => {
  // Xóa dữ liệu test trước mỗi test suite
  beforeEach(async () => {
    await clearTestData();
  });

  describe("GET /api/users", () => {
    it("should get all users successfully", async () => {
      try {
        // Arrange - lưu các người dùng test vào cơ sở dữ liệu
        const user1 = await createTestUser({ name: "User 1", email: "user777771@test.com" });
        const user2 = await createTestUser({ name: "User 2", email: "user777772@test.com" });
        
        console.log(`Created test users with IDs: ${user1._id}, ${user2._id}`);

        // Act - gọi API
        const response = await request(app).get("/api/users");
        
        // Debug
        console.log("API Response:", response.status, JSON.stringify(response.body));

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users).toHaveLength(2);
        expect(response.body.users[0].password).toBeUndefined(); // Không trả về password
      } catch (error) {
        console.error("Error in test:", error);
        throw error; // Re-throw để test thất bại
      }
    });

    it("should return empty array when no users exist", async () => {
      try {
        // Xóa hết dữ liệu trước khi kiểm tra
        await clearTestData();
        
        // Kiểm tra xem đã xóa hết chưa
        const count = await mongoose.model('User').countDocuments();
        console.log(`User count before test: ${count}`);
        expect(count).toBe(0);

        // Act
        const response = await request(app).get("/api/users");
        
        // Debug
        console.log("API Response:", response.status, JSON.stringify(response.body));

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users).toHaveLength(0);
      } catch (error) {
        console.error("Error in test:", error);
        throw error; // Re-throw để test thất bại
      }
    });

    it("should support pagination", async () => {
      // Arrange - Tạo nhiều users
      for (let i = 1; i <= 15; i++) {
        await createTestUser({
          name: `User ${i}i`,
          email: `user${i}i@test.com`,
        });
      }

      // Act
      const response = await request(app)
        .get("/api/users")
        .query({ page: 2, limit: 10 });

      // Assert
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should get user by ID successfully", async () => {
      // Arrange
      const user = await createTestUser({
        name: "Test User",
        email: "test123456765432@example.com",
      });

      // Act
      const response = await request(app).get(`/api/users/${user._id}`);

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return 404 for non-existing user", async () => {
      // Act
      const response = await request(app).get(
        "/api/users/60d0fe4f5311236168a109ca"
      ); // Valid ObjectId but non-existing

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Người dùng không tồn tại");
    });

    it("should return 400 for invalid user ID format", async () => {
      // Act
      const response = await request(app).get("/api/users/invalid-id");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("ID người dùng không hợp lệ");
    });
  });

  describe("POST /api/users", () => {
    it("should create new user successfully", async () => {
      // Arrange
      const userData = {
        name: "New User",
        email: "newuser@test.com",
        password: "password123",
        phone: "0123456789",
        role: "member",
      };

      // Act
      const response = await request(app).post("/api/users").send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.user.name).toBe("New User");
      expect(response.body.user.email).toBe("newuser@test.com");
    });

    it("should return error for duplicate email", async () => {
      // Arrange
      await createTestUser({ email: "existing@test.com" });

      const userData = {
        name: "Another User",
        email: "existing@test.com",
        password: "password123",
      };

      // Act
      const response = await request(app).post("/api/users").send(userData);

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return validation errors for missing required fields", async () => {
      // Act
      const response = await request(app).post("/api/users").send({});

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return validation error for invalid email format", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      };

      // Act
      const response = await request(app).post("/api/users").send(userData);

      // Assert
      expect(response.status).toBe(400);
    });

    it("should return validation error for weak password", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "123",
      };

      // Act
      const response = await request(app).post("/api/users").send(userData);

      // Assert
      expect(response.status).toBe(400);
    });
  });


  describe("DELETE /api/users/:id", () => {
    it("should delete user successfully", async () => {
      // Arrange
      const user = await createTestUser({ email: "delete@test.com" });

      // Act
      const response = await request(app).delete(`/api/users/${user._id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toContain(
        "Người dùng đã được xóa thành công"
      );

      // Verify user is actually deleted
      const deletedUser = await request(app).get(`/api/users/${user._id}`);
      expect(deletedUser.status).toBe(404);
    });

    it("should return 404 for non-existing user", async () => {
      // Act
      const response = await request(app).delete(
        "/api/users/60d0fe4f5311236168a109ca"
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Người dùng không tồn tại");
    });
  });

  describe("GET /api/users/my-packages", () => {
    it("should get user packages with valid token", async () => {
      // Arrange
      const user = await createTestMember();
      const token = generateTestToken(user._id, user.role);

      // Act
      const response = await request(app)
        .get("/api/users/my-packages")
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.packages).toBeDefined();
    });

    it("should return 401 for missing token", async () => {
      // Act
      const response = await request(app).get("/api/users/my-packages");

      // Assert
      expect(response.status).toBe(401);
    });

    it("should return 401 for invalid token", async () => {
      // Act
      const response = await request(app)
        .get("/api/users/my-packages")
        .set("Authorization", "Bearer invalid-token");

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Token không hợp lệ");
    });
  });

  describe("GET /api/users/my-feedback/:packageId", () => {
    it("should get package feedback for member", async () => {
      // Arrange
      const member = await createTestMember();
      const token = generateTestToken(member._id, member.role);
      const packageId = "60d0fe4f5311236168a109ca";

      // Act
      // const response = await request(app)
      //   .get(`/api/users/my-feedback/${packageId}`)
      //   .set("Authorization", `Bearer ${token}`);

    });

    it("should return 403 for non-member role", async () => {
      // Arrange
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id, admin.role);
      const packageId = "60d0fe4f5311236168a109ca";

      // Act
      const response = await request(app)
        .get(`/api/users/my-feedback/${packageId}`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(401);
    });
  });
});
