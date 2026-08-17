import { describe, it, expect } from "vitest";
import { User } from "../user.model.js";

describe("User model", () => {
  it("creates a valid user with defaults", async () => {
    const user = await User.create({
      name: "Tushar",
      email: "tushar@test.com",
      passwordHash: "hashedpw",
      employeeId: "1001",
    });

    expect(user.role).toBe("employee");
    expect(user.skills).toEqual([]);
  });

  it("rejects missing required fields", async () => {
    await expect(User.create({ name: "No Email" })).rejects.toThrow();
  });

  it("rejects duplicate email", async () => {
    await User.create({ name: "A", email: "dup@test.com", passwordHash: "x", employeeId: "1" });
    await expect(
      User.create({ name: "B", email: "dup@test.com", passwordHash: "y", employeeId: "2" })
    ).rejects.toThrow();
  });

  it("rejects duplicate employeeId", async () => {
    await User.create({ name: "A", email: "a1@test.com", passwordHash: "x", employeeId: "dup1" });
    await expect(
      User.create({ name: "B", email: "b1@test.com", passwordHash: "y", employeeId: "dup1" })
    ).rejects.toThrow();
  });

  it("rejects invalid role", async () => {
    await expect(
      User.create({ name: "C", email: "c@test.com", passwordHash: "z", employeeId: "3", role: "manager" })
    ).rejects.toThrow();
  });

  it("auto-generates createdAt and updatedAt", async () => {
    const user = await User.create({ name: "D", email: "d@test.com", passwordHash: "x", employeeId: "4" });
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});
