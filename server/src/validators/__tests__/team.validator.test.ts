import { describe, it, expect } from "vitest";
import { createTeamSchema, addMemberSchema } from "../team.validator.js";

describe("createTeamSchema", () => {
  it("passes with a valid name", async () => {
    await expect(createTeamSchema.validate({ name: "Dev Team" })).resolves.toBeTruthy();
  });

  it("rejects missing name", async () => {
    await expect(createTeamSchema.validate({})).rejects.toThrow();
  });
});

describe("addMemberSchema", () => {
  it("passes with a valid ObjectId string", async () => {
    await expect(addMemberSchema.validate({ userId: "507f1f77bcf86cd799439011" })).resolves.toBeTruthy();
  });

  it("rejects a malformed ObjectId", async () => {
    await expect(addMemberSchema.validate({ userId: "not-an-id" })).rejects.toThrow();
  });

  it("rejects missing userId", async () => {
    await expect(addMemberSchema.validate({})).rejects.toThrow();
  });
});