import { describe, it, expect } from "vitest";
import { createProjectSchema } from "../project.validator.js";

describe("createProjectSchema", () => {
  const base = {
    title: "New App",
    description: "A test project",
    type: "company",
    startDate: "2026-08-01",
    endDate: "2026-09-01",
  };

  it("passes with valid data", async () => {
    await expect(createProjectSchema.validate(base)).resolves.toBeTruthy();
  });

  it("rejects invalid type", async () => {
    await expect(createProjectSchema.validate({ ...base, type: "internal" })).rejects.toThrow();
  });

  it("rejects endDate before startDate", async () => {
    await expect(
      createProjectSchema.validate({ ...base, startDate: "2026-09-01", endDate: "2026-08-01" })
    ).rejects.toThrow();
  });

  it("rejects missing title", async () => {
    const { title, ...rest } = base;
    await expect(createProjectSchema.validate(rest)).rejects.toThrow();
  });
});