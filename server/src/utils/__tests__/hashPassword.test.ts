import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../hashPassword.js";

describe("hashPassword", () => {
  it("hashes a password", async () => {
    const hash = await hashPassword("mypassword123");
    expect(hash).not.toBe("mypassword123");
  });

  it("produces a different hash each time (salted)", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
  });
});

describe("comparePassword", () => {
  it("returns true for a matching password", async () => {
    const hash = await hashPassword("correcthorse");
    expect(await comparePassword("correcthorse", hash)).toBe(true);
  });

  it("returns false for a non-matching password", async () => {
    const hash = await hashPassword("correcthorse");
    expect(await comparePassword("wrongpassword", hash)).toBe(false);
  });
});