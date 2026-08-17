import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "../jwt.util";

describe("jwt utils", () => {
  it("signs and verifies a valid token", () => {
    const token = signToken({ id: "abc123", role: "admin" });
    const decoded = verifyToken(token);

    expect(decoded.id).toBe("abc123");
    expect(decoded.role).toBe("admin");
  });

  it("throws on an invalid token", () => {
    expect(() => verifyToken("not-a-real-token")).toThrow();
  });
});
