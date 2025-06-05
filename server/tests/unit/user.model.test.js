const User = require("../../models/User");
const bcrypt = require("bcryptjs");

describe("User Model", () => {
  describe("User Schema Validation", () => {
    it("should create a valid user with required fields", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe("Test User");
      expect(savedUser.email).toBe("test@example.com");
      expect(savedUser.role).toBe("member"); // Default value
      expect(savedUser.isActive).toBe(true); // Default value
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it("should require name field", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "password123",
      };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow("Path `name` is required");
    });

    it("should require email field", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        password: "password123",
      };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow("Path `email` is required");
    });

    it("should require password field", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        email: "test@example.com",
      };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow("Path `password` is required");
    });

    it("should enforce unique email constraint", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData1 = {
        name: "User 1",
        email: "duplicate@example.com",
        password: hashedPassword,
      };
      const userData2 = {
        name: "User 2",
        email: "duplicate@example.com",
        password: hashedPassword,
      };

      // Act
      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);

      // Assert
      await expect(user2.save()).rejects.toThrow();
    });

    it("should convert email to lowercase", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Test User",
        email: "TEST@EXAMPLE.COM",
        password: hashedPassword,
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.email).toBe("test@example.com");
    });

    it("should trim whitespace from name and email", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "  Test User  ",
        email: "  test@example.com  ",
        password: hashedPassword,
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.name).toBe("Test User");
      expect(savedUser.email).toBe("test@example.com");
    });

    it("should validate minimum password length", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "12345", // Only 5 characters
      };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow(
        "shorter than the minimum allowed length"
      );
    });

    it("should accept valid role values", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const roles = ["member", "admin", "employee", "trainer"];

      // Act & Assert
      for (const role of roles) {
        const userData = {
          name: `Test ${role}`,
          email: `${role}@example.com`,
          password: hashedPassword,
          role: role,
        };

        const user = new User(userData);
        const savedUser = await user.save();
        expect(savedUser.role).toBe(role);
      }
    });

    it("should reject invalid role values", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        role: "invalid_role",
      };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow(
        "`invalid_role` is not a valid enum value"
      );
    });
  });

  describe("Member Info", () => {
    it("should allow saving member-specific information", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Member User",
        email: "member@example.com",
        password: hashedPassword,
        role: "member",
        memberInfo: {
          gender: "male",
          dateOfBirth: new Date("1990-01-01"),
          job: "Software Developer",
          address: "123 Test Street",
          membershipStart: new Date(),
          membershipEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.memberInfo.gender).toBe("male");
      expect(savedUser.memberInfo.job).toBe("Software Developer");
      expect(savedUser.memberInfo.address).toBe("123 Test Street");
      expect(savedUser.memberInfo.membershipStart).toBeDefined();
      expect(savedUser.memberInfo.membershipEnd).toBeDefined();
    });
  });

  describe("Trainer Info", () => {
    it("should allow saving trainer-specific information", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Trainer User",
        email: "trainer@example.com",
        password: hashedPassword,
        role: "trainer",
        trainerInfo: {
          specialization: "Fitness Training",
          type: "gym",
        },
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.trainerInfo.specialization).toBe("Fitness Training");
      expect(savedUser.trainerInfo.type).toBe("gym");
    });

    it("should validate trainer type enum values", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const validTypes = ["yoga", "gym"];

      // Act & Assert
      for (const type of validTypes) {
        const userData = {
          name: `Trainer ${type}`,
          email: `trainer_${type}@example.com`,
          password: hashedPassword,
          role: "trainer",
          trainerInfo: {
            specialization: "Training",
            type: type,
          },
        };

        const user = new User(userData);
        const savedUser = await user.save();
        expect(savedUser.trainerInfo.type).toBe(type);
      }
    });

    it("should reject invalid trainer type values", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Trainer User",
        email: "trainer@example.com",
        password: hashedPassword,
        role: "trainer",
        trainerInfo: {
          specialization: "Training",
          type: "invalid_type",
        },
      };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow(
        "`invalid_type` is not a valid enum value"
      );
    });
  });

  describe("Timestamps", () => {
    it("should automatically set createdAt and updatedAt timestamps", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
      expect(savedUser.createdAt).toBeInstanceOf(Date);
      expect(savedUser.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt timestamp when user is modified", async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash("password123", 10);
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      };

      const user = new User(userData);
      const savedUser = await user.save();
      const originalUpdatedAt = savedUser.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      savedUser.name = "Updated Name";
      const updatedUser = await savedUser.save();

      // Assert
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });
});
