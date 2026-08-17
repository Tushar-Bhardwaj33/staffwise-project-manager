import { describe, it, expect } from "vitest";
import { Preference } from "../preference.model.js";
import { User } from "../user.model.js";
import { Project } from "../project.model.js";

describe("Preference model", () => {
  it("creates a valid preference", async () => {
    const employee = await User.create({ name: "Emp", email: "e1@test.com", passwordHash: "x", employeeId: "1" });
    const admin = await User.create({ name: "Admin", email: "a1@test.com", passwordHash: "x", employeeId: "2", role: "admin" });
    const project = await Project.create({
      title: "P1", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    const pref = await Preference.create({ project: project._id, employee: employee._id, interest: "interested" });
    expect(pref.interest).toBe("interested");
  });

  it("rejects invalid interest value", async () => {
    const employee = await User.create({ name: "Emp2", email: "e2@test.com", passwordHash: "x", employeeId: "3" });
    const admin = await User.create({ name: "Admin2", email: "a2@test.com", passwordHash: "x", employeeId: "4", role: "admin" });
    const project = await Project.create({
      title: "P2", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    await expect(
      Preference.create({ project: project._id, employee: employee._id, interest: "maybe" })
    ).rejects.toThrow();
  });

  it("blocks a second preference from the same employee on the same project", async () => {
    const employee = await User.create({ name: "Emp3", email: "e3@test.com", passwordHash: "x", employeeId: "5" });
    const admin = await User.create({ name: "Admin3", email: "a3@test.com", passwordHash: "x", employeeId: "6", role: "admin" });
    const project = await Project.create({
      title: "P3", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    await Preference.create({ project: project._id, employee: employee._id, interest: "interested" });
    await expect(
      Preference.create({ project: project._id, employee: employee._id, interest: "not-interested" })
    ).rejects.toThrow();
  });
});
