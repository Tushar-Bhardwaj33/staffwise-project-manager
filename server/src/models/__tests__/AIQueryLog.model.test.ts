import { describe, it, expect } from "vitest";
import { AIQueryLog } from "../aiQueryLog.model.js";
import { User } from "../user.model.js";
import { Project } from "../project.model.js";

describe("AIQueryLog model", () => {
  it("creates a valid log entry", async () => {
    const user = await User.create({ name: "U1", email: "u1@test.com", passwordHash: "x", employeeId: "1" });

    const log = await AIQueryLog.create({
      user: user._id,
      query: "What projects am I on?",
      response: "You are on Project X.",
    });

    expect(log.query).toBe("What projects am I on?");
  });

  it("stores optional context.projectId", async () => {
    const user = await User.create({ name: "U2", email: "u2@test.com", passwordHash: "x", employeeId: "2" });
    const admin = await User.create({ name: "Admin", email: "a@test.com", passwordHash: "x", employeeId: "3", role: "admin" });
    const project = await Project.create({
      title: "P1", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    const log = await AIQueryLog.create({
      user: user._id,
      query: "Who should staff this?",
      response: "Try Team A.",
      context: { projectId: project._id },
    });

    expect(log.context?.projectId?.toString()).toBe(project._id.toString());
  });

  it("rejects missing query or response", async () => {
    const user = await User.create({ name: "U3", email: "u3@test.com", passwordHash: "x", employeeId: "4" });
    await expect(AIQueryLog.create({ user: user._id, query: "Only query" })).rejects.toThrow();
  });
});
