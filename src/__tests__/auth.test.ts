/**
 * Auth utility tests — verify JWT token creation and verification
 * Uses the custom auth.ts implementation (no NextAuth dependency)
 */
import { describe, it, expect } from "vitest";
import { signAdminToken, verifyAdminToken, hasPermission } from "@/lib/auth";
import type { AdminSession } from "@/lib/auth";

const testPayload: AdminSession = {
  userId: "test-admin-id-001",
  email: "admin@saadsuhaib.local",
  role: "SUPER_ADMIN",
  name: "Test Admin",
};

describe("signAdminToken & verifyAdminToken", () => {
  it("should sign a JWT token (synchronous) and return a 3-part string", () => {
    const token = signAdminToken(testPayload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should verify a signed token and return the original payload fields", () => {
    const token = signAdminToken(testPayload);
    const verified = verifyAdminToken(token);

    expect(verified).not.toBeNull();
    expect(verified?.email).toBe(testPayload.email);
    expect(verified?.role).toBe(testPayload.role);
    expect(verified?.userId).toBe(testPayload.userId);
  });

  it("should return null for an invalid or tampered token", () => {
    const badToken = "eyJhbGciOiJIUzI1NiJ9.invalid.payload";
    expect(verifyAdminToken(badToken)).toBeNull();
  });

  it("should return null for an empty string token", () => {
    expect(verifyAdminToken("")).toBeNull();
  });

  it("should return null for a completely random string", () => {
    expect(verifyAdminToken("not-a-jwt-at-all")).toBeNull();
  });
});

describe("hasPermission (role hierarchy)", () => {
  it("SUPER_ADMIN should outrank all other roles", () => {
    expect(hasPermission("SUPER_ADMIN", "SUPER_ADMIN")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "STORE_MANAGER")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "ORDER_MANAGER")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "VIEWER")).toBe(true);
  });

  it("STORE_MANAGER should outrank ORDER_MANAGER and VIEWER", () => {
    expect(hasPermission("STORE_MANAGER", "ORDER_MANAGER")).toBe(true);
    expect(hasPermission("STORE_MANAGER", "VIEWER")).toBe(true);
    expect(hasPermission("STORE_MANAGER", "SUPER_ADMIN")).toBe(false);
  });

  it("VIEWER should only match VIEWER", () => {
    expect(hasPermission("VIEWER", "VIEWER")).toBe(true);
    expect(hasPermission("VIEWER", "ORDER_MANAGER")).toBe(false);
    expect(hasPermission("VIEWER", "SUPER_ADMIN")).toBe(false);
  });

  it("Unknown role should have no permissions", () => {
    expect(hasPermission("UNKNOWN_ROLE", "VIEWER")).toBe(false);
    expect(hasPermission("UNKNOWN_ROLE", "SUPER_ADMIN")).toBe(false);
  });
});
