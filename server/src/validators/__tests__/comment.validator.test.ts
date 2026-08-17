import { describe, it, expect } from "vitest";
import { createCommentSchema } from "../comment.validator.js";

describe("createCommentSchema", () => {
  it("requires a title for top-level comments", async () => {
    await expect(createCommentSchema.validate({ content: "hello" })).rejects.toThrow();
  });

  it("does not require a title for replies", async () => {
    await expect(
      createCommentSchema.validate({ content: "hello", parentComment: "507f1f77bcf86cd799439011" })
    ).resolves.toBeTruthy();
  });

  it("rejects missing content", async () => {
    await expect(createCommentSchema.validate({ title: "Topic" })).rejects.toThrow();
  });

  it("rejects malformed parentComment id", async () => {
    await expect(
      createCommentSchema.validate({ content: "hi", parentComment: "not-an-id" })
    ).rejects.toThrow();
  });
});
