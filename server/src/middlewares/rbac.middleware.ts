import type { Request, Response, NextFunction } from "express";

export const requireRole = (...allowedRoles: Array<"admin" | "employee">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden — insufficient permissions" });
    }

    next();
  };
};

export const isSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try{
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (userRole === "admin" || userId === req.params.employeeId) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
}};
