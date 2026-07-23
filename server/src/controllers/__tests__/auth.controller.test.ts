import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

describe("POST /api/auth/register", () => {
  it("creates a new employee account", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Tushar",
      email: "tushar@test.com",
      employeeId: "1001",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("employee");
  });

  it("rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "A", email: "dup@test.com", employeeId: "2001", password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "B", email: "dup@test.com", employeeId: "2002", password: "password123",
    });

    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login Test", email: "login@test.com", employeeId: "3001", password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@test.com", password: "password123",
    });

    expect(res.status).toBe(200);
  });

  it("rejects wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Wrong Pass", email: "wrongpass@test.com", employeeId: "4001", password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@test.com", password: "incorrect",
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});