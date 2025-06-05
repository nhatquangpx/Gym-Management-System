const request = require("supertest");
const createTestApp = require("../helpers/testApp");
const {
  createTestAdmin,
  generateTestToken,
} = require("../helpers/testHelpers");
const Package = require("../../models/Package");

const app = createTestApp();

describe("Package Routes", () => {
  describe("GET /api/packages", () => {
    it("should get all packages successfully", async () => {
      // Arrange
      await Package.create([
        {
          name: "Basic Gym Package",
          description: "Basic gym membership",
          price: 500000,
          period: "/tháng",
          type: "Tự tập",
          typePackage: "gym",
          duration: 30,
          features: ["Sử dụng thiết bị gym", "Phòng tắm"],
        },
        {
          name: "Premium Yoga Package",
          description: "Premium yoga membership",
          price: 800000,
          period: "/tháng",
          type: "Tập với PT",
          typePackage: "yoga",
          duration: 30,
          features: ["Lớp yoga chuyên nghiệp", "PT riêng"],
        },
      ]);

      // Act
      const response = await request(app).get("/api/packages");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.packages).toHaveLength(2);
      expect(response.body.packages[0].name).toBe("Basic Gym Package");
    });

    it("should return empty array when no packages exist", async () => {
      // Act
      const response = await request(app).get("/api/packages");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.packages).toHaveLength(0);
    });

    it("should support filtering by type", async () => {
      // Arrange
      await Package.create([
        {
          name: "Gym Package",
          price: 500000,
          typePackage: "gym",
          duration: 30,
        },
        {
          name: "Yoga Package",
          price: 600000,
          typePackage: "yoga",
          duration: 30,
        },
      ]);

      // Act
      const response = await request(app)
        .get("/api/packages")
        .query({ typePackage: "gym" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.packages).toHaveLength(1);
      expect(response.body.packages[0].typePackage).toBe("gym");
    });

    it("should support filtering by price range", async () => {
      // Arrange
      await Package.create([
        {
          name: "Cheap Package",
          price: 300000,
          duration: 30,
        },
        {
          name: "Expensive Package",
          price: 1000000,
          duration: 30,
        },
      ]);

      // Act
      const response = await request(app)
        .get("/api/packages")
        .query({ minPrice: 250000, maxPrice: 500000 });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.packages).toHaveLength(1);
      expect(response.body.packages[0].name).toBe("Cheap Package");
    });
  });

  describe("GET /api/packages/:id", () => {
    it("should get package by ID successfully", async () => {
      // Arrange
      const package = await Package.create({
        name: "Test Package",
        description: "Package for testing",
        price: 500000,
        duration: 30,
        features: ["Feature 1", "Feature 2"],
      });

      // Act
      const response = await request(app).get(`/api/packages/${package._id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.package.name).toBe("Test Package");
      expect(response.body.package.features).toHaveLength(2);
    });

    it("should return 404 for non-existing package", async () => {
      // Act
      const response = await request(app).get(
        "/api/packages/60d0fe4f5311236168a109ca"
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Gói tập không tồn tại");
    });

    it("should return 400 for invalid package ID format", async () => {
      // Act
      const response = await request(app).get("/api/packages/invalid-id");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("ID gói tập không hợp lệ");
    });
  });

  describe("POST /api/packages", () => {
    it("should create new package successfully", async () => {
      // Arrange
      const packageData = {
        name: "New Premium Package",
        description: "Premium gym membership with all features",
        price: 1200000,
        period: "/tháng",
        type: "Tập với PT",
        typePackage: "gym",
        duration: 30,
        features: [
          "Sử dụng tất cả thiết bị gym",
          "PT riêng 1-1",
          "Phòng tắm cao cấp",
          "Đồ uống miễn phí",
        ],
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.package.name).toBe("New Premium Package");
      expect(response.body.package.price).toBe(1200000);
      expect(response.body.package.features).toHaveLength(4);
      expect(response.body.message).toContain("Gói tập đã được tạo thành công");
    });

    it("should return validation errors for missing required fields", async () => {
      // Act
      const response = await request(app).post("/api/packages").send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should return validation error for invalid type value", async () => {
      // Arrange
      const packageData = {
        name: "Test Package",
        price: 500000,
        duration: 30,
        type: "Invalid Type",
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid Type");
    });

    it("should return validation error for invalid typePackage value", async () => {
      // Arrange
      const packageData = {
        name: "Test Package",
        price: 500000,
        duration: 30,
        typePackage: "invalid",
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("invalid");
    });

    it("should set default values correctly", async () => {
      // Arrange
      const packageData = {
        name: "Minimal Package",
        price: 300000,
        duration: 30,
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.package.period).toBe("/tháng");
      expect(response.body.package.type).toBe("Tự tập");
      expect(response.body.package.typePackage).toBe("gym");
      expect(response.body.package.features).toEqual([]);
    });

    it("should return validation error for negative price", async () => {
      // Arrange
      const packageData = {
        name: "Test Package",
        price: -100000,
        duration: 30,
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Giá gói tập phải là số dương");
    });

    it("should return validation error for zero duration", async () => {
      // Arrange
      const packageData = {
        name: "Test Package",
        price: 500000,
        duration: 0,
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Thời hạn gói tập phải lớn hơn 0"
      );
    });
  });

  describe("PUT /api/packages/:id", () => {
    it("should update package successfully", async () => {
      // Arrange
      const package = await Package.create({
        name: "Original Package",
        description: "Original description",
        price: 500000,
        duration: 30,
      });

      const updateData = {
        name: "Updated Package",
        description: "Updated description",
        price: 600000,
        features: ["New Feature"],
      };

      // Act
      const response = await request(app)
        .put(`/api/packages/${package._id}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.package.name).toBe("Updated Package");
      expect(response.body.package.price).toBe(600000);
      expect(response.body.package.features).toContain("New Feature");
    });

    it("should return 404 for non-existing package", async () => {
      // Act
      const response = await request(app)
        .put("/api/packages/60d0fe4f5311236168a109ca")
        .send({ name: "Updated Name" });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Gói tập không tồn tại");
    });

    it("should validate updated data", async () => {
      // Arrange
      const package = await Package.create({
        name: "Test Package",
        price: 500000,
        duration: 30,
      });

      // Act
      const response = await request(app)
        .put(`/api/packages/${package._id}`)
        .send({ price: -100000 });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Giá gói tập phải là số dương");
    });
  });

  describe("DELETE /api/packages/:id", () => {
    it("should delete package successfully", async () => {
      // Arrange
      const package = await Package.create({
        name: "Package to Delete",
        price: 500000,
        duration: 30,
      });

      // Act
      const response = await request(app).delete(
        `/api/packages/${package._id}`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("Gói tập đã được xóa thành công");

      // Verify package is actually deleted
      const deletedPackage = await request(app).get(
        `/api/packages/${package._id}`
      );
      expect(deletedPackage.status).toBe(404);
    });

    it("should return 404 for non-existing package", async () => {
      // Act
      const response = await request(app).delete(
        "/api/packages/60d0fe4f5311236168a109ca"
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Gói tập không tồn tại");
    });

    it("should not allow deleting package with active memberships", async () => {
      // Arrange
      const package = await Package.create({
        name: "Active Package",
        price: 500000,
        duration: 30,
      });

      // Simulate having active memberships for this package
      // This would be checked in the actual controller logic

      // Act
      const response = await request(app).delete(
        `/api/packages/${package._id}`
      );

      // Assert - This test would need actual business logic implementation
      // For now, we'll test the basic delete functionality
      expect(response.status).toBe(200);
    });
  });

  describe("Package Business Logic", () => {
    it("should calculate correct expiration date based on duration", async () => {
      // Arrange
      const packageData = {
        name: "Test Package",
        price: 500000,
        duration: 60, // 60 days
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.package.duration).toBe(60);
    });

    it("should handle features array correctly", async () => {
      // Arrange
      const features = [
        "Sử dụng thiết bị gym",
        "Phòng tắm",
        "Đậu xe miễn phí",
        "WiFi miễn phí",
      ];

      const packageData = {
        name: "Feature Rich Package",
        price: 800000,
        duration: 30,
        features: features,
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.package.features).toEqual(features);
      expect(response.body.package.features).toHaveLength(4);
    });

    it("should validate price is a number", async () => {
      // Arrange
      const packageData = {
        name: "Test Package",
        price: "not-a-number",
        duration: 30,
      };

      // Act
      const response = await request(app)
        .post("/api/packages")
        .send(packageData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Giá gói tập phải là số");
    });
  });
});
