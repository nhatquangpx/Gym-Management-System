const request = require("supertest");
const createTestApp = require("../helpers/testApp");
const {
  createTestUser,
  generateTestToken,
  createTestAdmin,
  createTestEmployee,
} = require("../helpers/testHelpers");
const Equipment = require("../../models/Equipment");
const GymRoom = require("../../models/GymRoom");

const app = createTestApp();

describe("Equipment Routes", () => {
  let testRoom;

  beforeEach(async () => {
    // Tạo gym room cho test
    testRoom = new GymRoom({
      name: "Test Room",
      description: "Room for testing",
      capacity: 20,
      isActive: true,
    });
    await testRoom.save();
  });

  describe("GET /api/equipments", () => {
    it("should get all equipments successfully", async () => {
      // Arrange
      await Equipment.create([
        {
          roomId: testRoom._id,
          name: "Treadmill 1",
          description: "High-quality treadmill",
          status: "active",
        },
        {
          roomId: testRoom._id,
          name: "Bike 1",
          description: "Exercise bike",
          status: "maintenance",
        },
      ]);

      // Act
      const response = await request(app).get("/api/equipments");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipments).toHaveLength(2);
      expect(response.body.equipments[0].name).toBe("Treadmill 1");
    });

    it("should return empty array when no equipments exist", async () => {
      // Act
      const response = await request(app).get("/api/equipments");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipments).toHaveLength(0);
    });

    it("should support filtering by status", async () => {
      // Arrange
      await Equipment.create([
        {
          roomId: testRoom._id,
          name: "Active Equipment",
          status: "active",
        },
        {
          roomId: testRoom._id,
          name: "Maintenance Equipment",
          status: "maintenance",
        },
      ]);

      // Act
      const response = await request(app)
        .get("/api/equipments")
        .query({ status: "active" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipments).toHaveLength(1);
      expect(response.body.equipments[0].name).toBe("Active Equipment");
    });
  });

  describe("GET /api/equipments/:id", () => {
    it("should get equipment by ID successfully", async () => {
      // Arrange
      const equipment = await Equipment.create({
        roomId: testRoom._id,
        name: "Test Equipment",
        description: "Equipment for testing",
        status: "active",
      });

      // Act
      const response = await request(app).get(
        `/api/equipments/${equipment._id}`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipment.name).toBe("Test Equipment");
      expect(response.body.equipment.description).toBe("Equipment for testing");
    });

    it("should return 404 for non-existing equipment", async () => {
      // Act
      const response = await request(app).get(
        "/api/equipments/60d0fe4f5311236168a109ca"
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Thiết bị không tồn tại");
    });

    it("should return 400 for invalid equipment ID format", async () => {
      // Act
      const response = await request(app).get("/api/equipments/invalid-id");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("ID thiết bị không hợp lệ");
    });
  });

  describe("GET /api/equipments/room/:id", () => {
    it("should get equipments by room ID successfully", async () => {
      // Arrange
      await Equipment.create([
        {
          roomId: testRoom._id,
          name: "Equipment 1",
          status: "active",
        },
        {
          roomId: testRoom._id,
          name: "Equipment 2",
          status: "active",
        },
      ]);

      // Act
      const response = await request(app).get(
        `/api/equipments/room/${testRoom._id}`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipments).toHaveLength(2);
    });

    it("should return empty array for room with no equipments", async () => {
      // Act
      const response = await request(app).get(
        `/api/equipments/room/${testRoom._id}`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipments).toHaveLength(0);
    });
  });

  describe("POST /api/equipments", () => {
    it("should create new equipment successfully", async () => {
      // Arrange
      const equipmentData = {
        roomId: testRoom._id,
        name: "New Treadmill",
        description: "Brand new treadmill",
        status: "active",
        purchaseDate: "2024-01-01",
        warrantyDate: "2025-01-01",
      };

      // Act
      const response = await request(app)
        .post("/api/equipments")
        .send(equipmentData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.equipment.name).toBe("New Treadmill");
      expect(response.body.equipment.description).toBe("Brand new treadmill");
      expect(response.body.message).toContain(
        "Thiết bị đã được tạo thành công"
      );
    });

    it("should return validation errors for missing required fields", async () => {
      // Act
      const response = await request(app).post("/api/equipments").send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should return error for invalid room ID", async () => {
      // Arrange
      const equipmentData = {
        roomId: "60d0fe4f5311236168a109ca", // Non-existing room
        name: "Test Equipment",
        status: "active",
      };

      // Act
      const response = await request(app)
        .post("/api/equipments")
        .send(equipmentData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Phòng tập không tồn tại");
    });
  });

  describe("PUT /api/equipments/:id", () => {
    it("should update equipment successfully", async () => {
      // Arrange
      const equipment = await Equipment.create({
        roomId: testRoom._id,
        name: "Original Name",
        description: "Original description",
        status: "active",
      });

      const updateData = {
        name: "Updated Name",
        description: "Updated description",
        status: "maintenance",
      };

      // Act
      const response = await request(app)
        .put(`/api/equipments/${equipment._id}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.equipment.name).toBe("Updated Name");
      expect(response.body.equipment.description).toBe("Updated description");
      expect(response.body.equipment.status).toBe("maintenance");
    });

    it("should return 404 for non-existing equipment", async () => {
      // Act
      const response = await request(app)
        .put("/api/equipments/60d0fe4f5311236168a109ca")
        .send({ name: "Updated Name" });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Thiết bị không tồn tại");
    });
  });

  describe("DELETE /api/equipments/:id", () => {
    it("should delete equipment successfully", async () => {
      // Arrange
      const equipment = await Equipment.create({
        roomId: testRoom._id,
        name: "Equipment to Delete",
        status: "active",
      });

      // Act
      const response = await request(app).delete(
        `/api/equipments/${equipment._id}`
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "Thiết bị đã được xóa thành công"
      );

      // Verify equipment is actually deleted
      const deletedEquipment = await request(app).get(
        `/api/equipments/${equipment._id}`
      );
      expect(deletedEquipment.status).toBe(404);
    });

    it("should return 404 for non-existing equipment", async () => {
      // Act
      const response = await request(app).delete(
        "/api/equipments/60d0fe4f5311236168a109ca"
      );

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Thiết bị không tồn tại");
    });
  });

  describe("POST /api/equipments/maintenance-email", () => {
    it("should send maintenance email with admin token", async () => {
      // Arrange
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id, admin.role);

      const equipment = await Equipment.create({
        roomId: testRoom._id,
        name: "Maintenance Equipment",
        status: "maintenance",
      });

      const emailData = {
        equipmentId: equipment._id,
        recipientEmail: "maintenance@test.com",
        message: "Equipment needs maintenance",
      };

      // Act
      const response = await request(app)
        .post("/api/equipments/maintenance-email")
        .set("Authorization", `Bearer ${token}`)
        .send(emailData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "Email bảo trì đã được gửi thành công"
      );
    });

    it("should send maintenance email with employee token", async () => {
      // Arrange
      const employee = await createTestEmployee();
      const token = generateTestToken(employee._id, employee.role);

      const equipment = await Equipment.create({
        roomId: testRoom._id,
        name: "Maintenance Equipment",
        status: "maintenance",
      });

      const emailData = {
        equipmentId: equipment._id,
        recipientEmail: "maintenance@test.com",
        message: "Equipment needs maintenance",
      };

      // Act
      const response = await request(app)
        .post("/api/equipments/maintenance-email")
        .set("Authorization", `Bearer ${token}`)
        .send(emailData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 403 for non-admin/employee role", async () => {
      // Arrange
      const member = await createTestUser({ role: "member" });
      const token = generateTestToken(member._id, member.role);

      // Act
      const response = await request(app)
        .post("/api/equipments/maintenance-email")
        .set("Authorization", `Bearer ${token}`)
        .send({
          equipmentId: "60d0fe4f5311236168a109ca",
          recipientEmail: "test@test.com",
        });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Không có quyền truy cập");
    });

    it("should return 401 for missing token", async () => {
      // Act
      const response = await request(app)
        .post("/api/equipments/maintenance-email")
        .send({
          equipmentId: "60d0fe4f5311236168a109ca",
          recipientEmail: "test@test.com",
        });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Token không được cung cấp");
    });
  });

  describe("POST /api/equipments/bulk-maintenance-email", () => {
    it("should send bulk maintenance emails with admin token", async () => {
      // Arrange
      const admin = await createTestAdmin();
      const token = generateTestToken(admin._id, admin.role);

      const equipment1 = await Equipment.create({
        roomId: testRoom._id,
        name: "Equipment 1",
        status: "maintenance",
      });

      const equipment2 = await Equipment.create({
        roomId: testRoom._id,
        name: "Equipment 2",
        status: "maintenance",
      });

      const emailData = {
        equipmentIds: [equipment1._id, equipment2._id],
        recipientEmails: ["maintenance1@test.com", "maintenance2@test.com"],
        message: "Multiple equipments need maintenance",
      };

      // Act
      const response = await request(app)
        .post("/api/equipments/bulk-maintenance-email")
        .set("Authorization", `Bearer ${token}`)
        .send(emailData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain(
        "Email bảo trì hàng loạt đã được gửi thành công"
      );
    });

    it("should return 403 for non-admin/employee role", async () => {
      // Arrange
      const member = await createTestUser({ role: "member" });
      const token = generateTestToken(member._id, member.role);

      // Act
      const response = await request(app)
        .post("/api/equipments/bulk-maintenance-email")
        .set("Authorization", `Bearer ${token}`)
        .send({
          equipmentIds: ["60d0fe4f5311236168a109ca"],
          recipientEmails: ["test@test.com"],
        });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Không có quyền truy cập");
    });
  });
});
