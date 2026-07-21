import { describe, it, expect } from "vitest";
import { updateProfileSchema, updateRoleSchema } from "../user.validator.js";

describe("updateProfileSchema", () => {
  it("passes with partial update", async () => {
    await expect(updateProfileSchema.validate({ name: "New Name" })).resolves.toBeTruthy();
  });

  it("passes with skills array", async () => {
    await expect(updateProfileSchema.validate({ skills: ["React", "Node"] })).resolves.toBeTruthy();
  });
});

describe("updateRoleSchema", () => {
  it("passes with valid role", async () => {
    await expect(updateRoleSchema.validate({ role: "admin" })).resolves.toBeTruthy();
  });

  it("rejects invalid role", async () => {
    await expect(updateRoleSchema.validate({ role: "superadmin" })).rejects.toThrow();
  });

  it("rejects missing role", async () => {
    await expect(updateRoleSchema.validate({})).rejects.toThrow();
  });
});