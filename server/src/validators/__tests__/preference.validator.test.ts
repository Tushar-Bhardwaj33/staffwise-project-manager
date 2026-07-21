import { describe, it, expect } from "vitest";
import { submitPreferenceSchema } from "../preference.validator.js";

describe("submitPreferenceSchema", () => {
  it("passes with 'interested'", async () => {
    await expect(submitPreferenceSchema.validate({ interest: "interested" })).resolves.toBeTruthy();
  });

  it("passes with 'not-interested' and a reason", async () => {
    await expect(
      submitPreferenceSchema.validate({ interest: "not-interested", reason: "Scheduling conflict" })
    ).resolves.toBeTruthy();
  });

  it("rejects invalid interest value", async () => {
    await expect(submitPreferenceSchema.validate({ interest: "maybe" })).rejects.toThrow();
  });

  it("rejects missing interest", async () => {
    await expect(submitPreferenceSchema.validate({})).rejects.toThrow();
  });
});