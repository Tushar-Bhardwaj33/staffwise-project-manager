import { Project } from "../models/Project.model.js";
import { User } from "../models/User.model.js";
import { Preference } from "../models/Preference.model.js";
import { Team } from "../models/Team.model.js";
import { adminQaGraph } from "../agents/admin/graph.js";

const WEIGHT_INTERESTED = 0.3;
const WEIGHT_NOT_INTERESTED = -0.5;
const WEIGHT_BUSY = -0.2;

export interface ICandidateScore {
  employee: {
    id: string;
    name: string;
    employeeId: string;
    skills: string[];
  };
  score: number;
  matchedSkills: string[];
  preference: "interested" | "not-interested" | "no-response";
  available: boolean;
  explanation?: string;
}

export const getRankedCandidates = async (projectId: string): Promise<ICandidateScore[]> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const employees = await User.find({ role: "employee" }).lean();
  const preferences = await Preference.find({ project: projectId }).lean();
  
  const preferenceMap = new Map<string, "interested" | "not-interested">();
  for (const pref of preferences) {
    preferenceMap.set(pref.employee.toString(), pref.interest);
  }

  // Derive availability: check for overlapping projects
  const activeProjects = await Project.find({
    _id: { $ne: project._id },
    endDate: { $gte: project.startDate },
    startDate: { $lte: project.endDate },
    assignedTeams: { $exists: true, $not: { $size: 0 } }
  }).lean();

  const busyTeamIds = new Set<string>();
  for (const p of activeProjects) {
    for (const teamId of p.assignedTeams || []) {
      busyTeamIds.add(teamId.toString());
    }
  }

  const busyTeams = await Team.find({ _id: { $in: Array.from(busyTeamIds) } }).lean();
  const busyEmployeeIds = new Set<string>();
  for (const t of busyTeams) {
    for (const memberId of t.members || []) {
      busyEmployeeIds.add(memberId.toString());
    }
  }

  const requiredSkillsLower = project.requiredSkills?.map(s => s.toLowerCase()) || [];

  const candidates: ICandidateScore[] = employees.map(emp => {
    const empId = emp._id.toString();
    const empSkills = emp.skills || [];
    const empSkillsLower = empSkills.map(s => s.toLowerCase());
    
    const matchedSkills = empSkillsLower.filter(s => requiredSkillsLower.includes(s));
    
    let score = 0;
    if (requiredSkillsLower.length > 0) {
      score += matchedSkills.length / requiredSkillsLower.length;
    }

    const interest = preferenceMap.get(empId);
    if (interest === "interested") score += WEIGHT_INTERESTED;
    if (interest === "not-interested") score += WEIGHT_NOT_INTERESTED;

    const available = !busyEmployeeIds.has(empId);
    if (!available) {
      score += WEIGHT_BUSY;
    }

    // Clamp and round
    score = Math.max(0, score);
    score = Math.round(score * 100) / 100;

    // Restore original casing for matched skills
    const displayMatchedSkills = empSkills.filter(s => requiredSkillsLower.includes(s.toLowerCase()));

    return {
      employee: {
        id: empId,
        name: emp.name,
        employeeId: emp.employeeId,
        skills: empSkills,
      },
      score,
      matchedSkills: displayMatchedSkills,
      preference: interest || "no-response",
      available
    };
  });

  candidates.sort((a, b) => b.score - a.score);

  // Optional: Narrative LLM explanation for top 3
  const topCandidates = candidates.slice(0, 3);
  try {
    for (const candidate of topCandidates) {
      const query = `Provide a one-sentence justification for why this candidate is a good fit for the project. Score: ${candidate.score}, Skills: ${candidate.employee.skills.join(', ')}, Matched: ${candidate.matchedSkills.join(', ')}, Preference: ${candidate.preference}, Available: ${candidate.available}.`;
      const result = await adminQaGraph.invoke({ query, projectId, employeeIdentifier: candidate.employee.employeeId });
      if (result.response) {
        candidate.explanation = result.response.trim();
      }
    }
  } catch (error) {
    console.error("Failed to generate LLM explanations for candidates:", error);
  }

  return candidates;
};
