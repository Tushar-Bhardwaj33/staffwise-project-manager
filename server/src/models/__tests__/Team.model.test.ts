import { describe, it, expect } from "vitest";
import { Team } from "../team.model.js";
import { User } from "../user.model.js";

describe("Team model", () => {
  it("creates a valid team", async () => {
    const admin = await User.create({ name: "Admin", email: "admin@test.com", passwordHash: "x", employeeId: "1", role: "admin" });
    const team = await Team.create({ name: "Dev Team", createdBy: admin._id });

    expect(team.name).toBe("Dev Team");
    expect(team.members).toEqual([]);
  });

  it("rejects missing name", async () => {
    const admin = await User.create({ name: "Admin", email: "admin2@test.com", passwordHash: "x", employeeId: "2", role: "admin" });
    await expect(Team.create({ createdBy: admin._id })).rejects.toThrow();
  });

  it("rejects missing createdBy", async () => {
    await expect(Team.create({ name: "No Creator" })).rejects.toThrow();
  });

  it("stores member references correctly", async () => {
    const admin = await User.create({ name: "Admin", email: "admin3@test.com", passwordHash: "x", employeeId: "3", role: "admin" });
    const employee = await User.create({ name: "Emp", email: "emp@test.com", passwordHash: "x", employeeId: "4" });

    const team = await Team.create({ name: "QA Team", createdBy: admin._id, members: [employee._id] });
    expect(team.members).toHaveLength(1);
    expect(team.members[0].toString()).toBe(employee._id.toString());
  });
});
