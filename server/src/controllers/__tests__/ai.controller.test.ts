import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { User } from "../../models/user.model.js";
import { Project } from "../../models/project.model.js";
import { Team } from "../../models/team.model.js";
import { AIQueryLog } from "../../models/aiQueryLog.model.js";

vi.mock("../../agents/admin/graph.js", () => ({
  adminGraph: { invoke: vi.fn().mockResolvedValue({ response: "mocked summary" }) },
  adminQaGraph: { invoke: vi.fn().mockResolvedValue({ response: "mocked answer" }) },
}));

describe("POST /api/ai/query", () => {
  let employeeToken: string;
  let adminToken: string;
  let employeeId: string;
  let adminId: string;
  let projectId: string;
  let otherProjectId: string;

  beforeEach(async () => {
    // Setup users
    const empRes = await request(app).post("/api/auth/register").send({
      name: "Emp AI", email: "emp.ai@test.com", employeeId: "AI100", password: "password"
    });
    employeeId = empRes.body.user._id;

    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Admin AI", email: "admin.ai@test.com", employeeId: "AI200", password: "password"
    });
    adminId = adminRes.body.user._id;
    await User.findByIdAndUpdate(adminId, { role: "admin" });

    // Login
    const empLogin = await request(app).post("/api/auth/login").send({ email: "emp.ai@test.com", password: "password" });
    employeeToken = empLogin.headers["set-cookie"]?.find((c: string) => c.startsWith("token="));

    const adminLogin = await request(app).post("/api/auth/login").send({ email: "admin.ai@test.com", password: "password" });
    adminToken = adminLogin.headers["set-cookie"]?.find((c: string) => c.startsWith("token="));

    // Create projects
    const team = await Team.create({ name: "AI Team " + Date.now(), members: [employeeId], createdBy: adminId });
    const p1 = await Project.create({
      title: "Allowed", description: "d", type: "company", startDate: new Date(), endDate: new Date(),
      assignedTeams: [team._id], createdBy: adminId
    });
    projectId = p1._id.toString();

    const p2 = await Project.create({
      title: "Denied", description: "d", type: "company", startDate: new Date(), endDate: new Date(),
      assignedTeams: [], createdBy: adminId
    });
    otherProjectId = p2._id.toString();
  });

  it("returns 401 without auth cookie", async () => {
    const res = await request(app).post("/api/ai/query").send({ query: "Hello" });
    expect(res.status).toBe(401);
  });

  it("returns 403 when an admin token hits the route", async () => {
    const res = await request(app)
      .post("/api/ai/query")
      .set("Cookie", adminToken)
      .send({ query: "Hello" });
    expect(res.status).toBe(403);
  });

  it("returns 403 when an employee requests a project they are not on", async () => {
    const res = await request(app)
      .post("/api/ai/query")
      .set("Cookie", employeeToken)
      .send({ query: "Hello", projectId: otherProjectId });
    expect(res.status).toBe(403);
  });

  it("returns 200 and creates a log when requesting with no projectId", async () => {
    const res = await request(app)
      .post("/api/ai/query")
      .set("Cookie", employeeToken)
      .send({ query: "Hello" });
    
    expect(res.status).toBe(200);
    expect(res.body.response).toBe("mocked answer");

    const logs = await AIQueryLog.find({ user: employeeId });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].query).toBe("Hello");
  });

  it("returns 200 and creates a log when requesting with allowed projectId", async () => {
    const res = await request(app)
      .post("/api/ai/query")
      .set("Cookie", employeeToken)
      .send({ query: "Hello Project", projectId });
    
    expect(res.status).toBe(200);
    expect(res.body.response).toBe("mocked answer");

    const logs = await AIQueryLog.find({ user: employeeId, "context.projectId": projectId });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].query).toBe("Hello Project");
  });
});
