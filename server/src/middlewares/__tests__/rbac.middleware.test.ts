import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { requireRole } from "../rbac.middleware.js";

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe("requireRole", () => {
  it("returns 401 when req.user is missing", () => {
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when role is not allowed", () => {
    const req = { user: { id: "1", role: "employee" } } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when role is allowed", () => {
    const req = { user: { id: "1", role: "admin" } } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    requireRole("admin")(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("allows multiple roles", () => {
    const req = { user: { id: "1", role: "employee" } } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    requireRole("admin", "employee")(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});