import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getMembershipStatus,
  formatDate,
  formatRemainingDays,
  getRenewalEligibility,
} from "../membershipUtils";

// Mock axios
vi.mock("axios");

describe("membershipUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMembershipStatus", () => {
    it("should return membership info on successful API call", async () => {
      const mockMembershipInfo = {
        id: 1,
        status: "active",
        expiryDate: "2024-12-31",
        packageName: "Premium Package",
      };

      axios.get.mockResolvedValueOnce({
        data: { membershipInfo: mockMembershipInfo },
      });

      const result = await getMembershipStatus();

      expect(axios.get).toHaveBeenCalledWith(
        "/api/membership-status/membership-status"
      );
      expect(result).toEqual(mockMembershipInfo);
    });

    it("should throw error when API call fails", async () => {
      const mockError = new Error("Network error");
      axios.get.mockRejectedValueOnce(mockError);

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(getMembershipStatus()).rejects.toThrow("Network error");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching membership status:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("formatDate", () => {
    it("should format valid date string correctly", () => {
      const dateString = "2024-03-15";
      const result = formatDate(dateString);

      // Expected format: DD/MM/YYYY for Vietnamese locale
      expect(result).toBe("15/03/2024");
    });

    it("should format Date object correctly", () => {
      const date = new Date("2024-03-15");
      const result = formatDate(date);

      expect(result).toBe("15/03/2024");
    });

    it('should return "N/A" for null input', () => {
      expect(formatDate(null)).toBe("N/A");
    });

    it('should return "N/A" for undefined input', () => {
      expect(formatDate(undefined)).toBe("N/A");
    });

    it('should return "N/A" for empty string', () => {
      expect(formatDate("")).toBe("N/A");
    });

    it("should handle different date formats", () => {
      const isoDate = "2024-12-25T10:30:00Z";
      const result = formatDate(isoDate);

      expect(result).toBe("25/12/2024");
    });
  });

  describe("formatRemainingDays", () => {
    it("should format positive days correctly", () => {
      expect(formatRemainingDays(30)).toBe("Còn 30 ngày");
      expect(formatRemainingDays(1)).toBe("Còn 1 ngày");
      expect(formatRemainingDays(365)).toBe("Còn 365 ngày");
    });

    it("should format negative days correctly", () => {
      expect(formatRemainingDays(-30)).toBe("Đã hết hạn 30 ngày");
      expect(formatRemainingDays(-1)).toBe("Đã hết hạn 1 ngày");
      expect(formatRemainingDays(-365)).toBe("Đã hết hạn 365 ngày");
    });

    it("should format zero days correctly", () => {
      expect(formatRemainingDays(0)).toBe("Hết hạn hôm nay");
    });

    it("should return empty string for null input", () => {
      expect(formatRemainingDays(null)).toBe("");
    });

    it("should return empty string for undefined input", () => {
      expect(formatRemainingDays(undefined)).toBe("");
    });

    it("should handle edge cases with very large numbers", () => {
      expect(formatRemainingDays(9999)).toBe("Còn 9999 ngày");
      expect(formatRemainingDays(-9999)).toBe("Đã hết hạn 9999 ngày");
    });
  });

  describe("getRenewalEligibility", () => {
    it("should return register action for null membership info", () => {
      const result = getRenewalEligibility(null);

      expect(result).toEqual({
        eligible: false,
        action: "register",
        message: "Bạn chưa có gói tập. Hãy đăng ký một gói tập mới.",
      });
    });

    it("should return register action for undefined membership info", () => {
      const result = getRenewalEligibility(undefined);

      expect(result).toEqual({
        eligible: false,
        action: "register",
        message: "Bạn chưa có gói tập. Hãy đăng ký một gói tập mới.",
      });
    });

    it("should return renew action for active membership", () => {
      const membershipInfo = {
        id: 1,
        status: "active",
        expiryDate: "2024-12-31",
      };

      const result = getRenewalEligibility(membershipInfo);

      expect(result).toEqual({
        eligible: true,
        action: "renew",
        message: "Bạn có thể gia hạn gói tập hiện tại.",
      });
    });

    it("should return buyMore action for expired membership", () => {
      const membershipInfo = {
        id: 1,
        status: "expired",
        expiryDate: "2024-01-01",
      };

      const result = getRenewalEligibility(membershipInfo);

      expect(result).toEqual({
        eligible: true,
        action: "buyMore",
        message: "Gói tập của bạn đã hết hạn. Bạn có thể mua thêm gói tập mới.",
      });
    });

    it("should return register action for other status types", () => {
      const membershipInfo = {
        id: 1,
        status: "pending",
        expiryDate: "2024-12-31",
      };

      const result = getRenewalEligibility(membershipInfo);

      expect(result).toEqual({
        eligible: false,
        action: "register",
        message: "Bạn cần đăng ký một gói tập.",
      });
    });

    it("should handle membership info without status", () => {
      const membershipInfo = {
        id: 1,
        expiryDate: "2024-12-31",
      };

      const result = getRenewalEligibility(membershipInfo);

      expect(result).toEqual({
        eligible: false,
        action: "register",
        message: "Bạn cần đăng ký một gói tập.",
      });
    });

    it("should handle various status values", () => {
      const statuses = ["inactive", "cancelled", "suspended"];

      statuses.forEach((status) => {
        const membershipInfo = { id: 1, status };
        const result = getRenewalEligibility(membershipInfo);

        expect(result.eligible).toBe(false);
        expect(result.action).toBe("register");
        expect(result.message).toBe("Bạn cần đăng ký một gói tập.");
      });
    });
  });
});
