import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../auth.middleware.js";
import { signToken } from "../../utils/jwt.util.js";

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe("authMiddleware", () => {
  it("returns 401 when no authorization header is present", () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a malformed authorization header", () => {
    const req = { headers: { authorization: "NotBearer sometoken" } } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 for an invalid token", () => {
    const req = { headers: { authorization: "Bearer invalidtoken" } } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches req.user and calls next for a valid token", () => {
  const token = signToken({ id: "user1", role: "employee" });
  const req = { headers: { authorization: `Bearer ${token}` } } as Request;
  const res = mockRes();
  const next = vi.fn() as NextFunction;

  authMiddleware(req, res, next);

  expect(req.user).toMatchObject({ id: "user1", role: "employee" });
  expect(next).toHaveBeenCalled();
  });
});
