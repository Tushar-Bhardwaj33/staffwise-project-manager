import { describe, it, expect } from "vitest";
import { uploadDocumentSchema } from "../document.validator.js";

describe("uploadDocumentSchema", () => {
  it("passes with a valid title", async () => {
    await expect(uploadDocumentSchema.validate({ title: "Requirements" })).resolves.toBeTruthy();
  });

  it("rejects missing title", async () => {
    await expect(uploadDocumentSchema.validate({})).rejects.toThrow();
  });
});