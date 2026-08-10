import { User } from "../models/User.model.js";
import { Team } from "../models/Team.model.js";
import { Project } from "../models/Project.model.js";
import { Types } from "mongoose";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const findEmployeeByIdentifier = async (identifier: number) => {
  const employee = await User.findOne({
    role: "employee",
    $or: [{ employeeId: identifier }, { name: new RegExp(escapeRegex(identifier.toString()), "i") }],
  });
  if (!employee) {
    throw new Error("EMPLOYEE_NOT_FOUND");
  }
  return employee;
};

export const getProjectsForEmployee = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);
  const teams = await Team.find({ members: userObjectId }).select("_id");
  const teamIds = teams.map((t) => t._id);
  return Project.find({ assignedTeams: { $in: teamIds } });
};