import { describe, it, expect } from "vitest";
import { Project } from "../Project.model.js";
import { User } from "../User.model.js";

describe("Project model", () => {
  it("creates a valid project", async () => {
    const admin = await User.create({ name: "Admin", email: "a@test.com", passwordHash: "x", employeeId: "1", role: "admin" });

    const project = await Project.create({
      title: "New App",
      description: "A test project",
      type: "company",
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-09-01"),
      createdBy: admin._id,
    });

    expect(project.type).toBe("company");
    expect(project.requiredSkills).toEqual([]);
    expect(project.assignedTeams).toEqual([]);
  });

  it("rejects invalid type", async () => {
    const admin = await User.create({ name: "Admin", email: "b@test.com", passwordHash: "x", employeeId: "2", role: "admin" });
    await expect(
      Project.create({
        title: "Bad",
        description: "d",
        type: "internal", // not in enum
        startDate: new Date(),
        endDate: new Date(),
        createdBy: admin._id,
      })
    ).rejects.toThrow();
  });

  it("rejects missing required fields", async () => {
    await expect(Project.create({ title: "Incomplete" })).rejects.toThrow();
  });

  it("stores assignedTeams as references", async () => {
    const admin = await User.create({ name: "Admin", email: "c@test.com", passwordHash: "x", employeeId: "3", role: "admin" });
    const project = await Project.create({
      title: "P2",
      description: "d",
      type: "client",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      createdBy: admin._id,
    });
    expect(project.assignedTeams).toHaveLength(0);
  });
});