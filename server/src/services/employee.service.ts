// server/src/services/employee.service.ts
import { User } from "../models/User.model.js";
import { Team } from "../models/Team.model.js";
import { Project } from "../models/Project.model.js";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const findEmployeeByIdentifier = async (identifier: string) => {
  const employee = await User.findOne({
    role: "employee",
    $or: [{ employeeId: identifier }, { name: new RegExp(escapeRegex(identifier), "i") }],
  });
  if (!employee) {
    throw new Error("EMPLOYEE_NOT_FOUND");
  }
  return employee;
};

export const getProjectsForEmployee = async (userId: string) => {
  const teams = await Team.find({ members: userId }).select("_id");
  const teamIds = teams.map((t) => t._id);
  return Project.find({ assignedTeams: { $in: teamIds } });
};