import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "../auth.validator.js";

describe("registerSchema", () => {
  it("passes with valid data", async () => {
    await expect(
      registerSchema.validate({ name: "Tushar", email: "t@test.com", employeeId: "1001", password: "password123" })
    ).resolves.toBeTruthy();
  });

  it("rejects invalid email", async () => {
    await expect(
      registerSchema.validate({ name: "T", email: "not-an-email", employeeId: "1", password: "password123" })
    ).rejects.toThrow();
  });

  it("rejects short password", async () => {
    await expect(
      registerSchema.validate({ name: "T", email: "t@test.com", employeeId: "1", password: "123" })
    ).rejects.toThrow();
  });

  it("rejects missing name", async () => {
    await expect(
      registerSchema.validate({ email: "t@test.com", employeeId: "1", password: "password123" })
    ).rejects.toThrow();
  });
});

describe("loginSchema", () => {
  it("passes with valid credentials", async () => {
    await expect(loginSchema.validate({ email: "t@test.com", password: "password123" })).resolves.toBeTruthy();
  });

  it("rejects missing password", async () => {
    await expect(loginSchema.validate({ email: "t@test.com" })).rejects.toThrow();
  });
});
