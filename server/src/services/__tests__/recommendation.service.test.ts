import { describe, it, expect, beforeEach, vi } from "vitest";
import { getRankedCandidates } from "../recommendation.service.js";
import { User } from "../../models/user.model.js";
import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import { Preference } from "../../models/preference.model.js";

vi.mock("../../agents/admin/graph.js", () => ({
  adminQaGraph: { invoke: vi.fn().mockResolvedValue({ response: "mocked explanation" }) }
}));

describe("Recommendation Service", () => {
  let projectId: string;
  let adminId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Team.deleteMany({});
    await Preference.deleteMany({});

    const admin = await User.create({
      name: "Admin", email: "admin@test.com", employeeId: "A1", passwordHash: "x", role: "admin"
    });
    adminId = admin._id.toString();

    const p = await Project.create({
      title: "Rec Test", description: "d", type: "company", 
      requiredSkills: ["React", "Node"], 
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), 
      createdBy: admin._id
    });
    projectId = p._id.toString();
  });

  it("ranks candidates correctly based on deterministic rules", async () => {
    // Employee A: 2 skills, interested, available
    const empA = await User.create({ name: "Emp A", email: "a@test.com", employeeId: "E1", passwordHash: "x", role: "employee", skills: ["React", "Node"] });
    await Preference.create({ project: projectId, employee: empA._id, interest: "interested" });

    // Employee B: 0 skills, not-interested, available
    const empB = await User.create({ name: "Emp B", email: "b@test.com", employeeId: "E2", passwordHash: "x", role: "employee", skills: ["Python"] });
    await Preference.create({ project: projectId, employee: empB._id, interest: "not-interested" });

    // Employee C: 1 skill, no preference, busy
    const empC = await User.create({ name: "Emp C", email: "c@test.com", employeeId: "E3", passwordHash: "x", role: "employee", skills: ["React"] });
    
    // Make C busy
    const team = await Team.create({ name: "Busy Team", members: [empC._id], createdBy: adminId });
    await Project.create({
      title: "Busy Project", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000),
      assignedTeams: [team._id], createdBy: adminId
    });

    const candidates = await getRankedCandidates(projectId);
    
    expect(candidates).toHaveLength(3);

    // Emp A: Base = 2/2 = 1.0, pref = +0.3, avail = 0 => 1.3
    expect(candidates[0].employee.name).toBe("Emp A");
    expect(candidates[0].score).toBe(1.3);
    expect(candidates[0].available).toBe(true);
    expect(candidates[0].matchedSkills).toEqual(["React", "Node"]);

    // Emp C: Base = 1/2 = 0.5, pref = 0, avail = -0.2 => 0.3
    expect(candidates[1].employee.name).toBe("Emp C");
    expect(candidates[1].score).toBe(0.3);
    expect(candidates[1].available).toBe(false);
    expect(candidates[1].matchedSkills).toEqual(["React"]);

    // Emp B: Base = 0, pref = -0.5, avail = 0 => -0.5 clamped to 0
    expect(candidates[2].employee.name).toBe("Emp B");
    expect(candidates[2].score).toBe(0);
    expect(candidates[2].available).toBe(true);
    expect(candidates[2].matchedSkills).toEqual([]);
  });
});
