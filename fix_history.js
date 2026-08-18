import fs from 'fs';

let content = fs.readFileSync('server/src/controllers/history.controller.ts', 'utf-8');

// Add import for userCanAccessProject
content = content.replace(
  "import { memberOfProjectTeam } from '../utils/projectAccess.util.js';",
  "import { memberOfProjectTeam, userCanAccessProject, isProjectAdmin } from '../utils/projectAccess.util.js';"
);

// Bug 29: submitValidation
content = content.replace(
  "if(!req.user || !req.user.id) {\n      return res.status(401).json({ message: 'Unauthorized' });\n    }",
  "if(!req.user || !req.user.id) {\n      return res.status(401).json({ message: 'Unauthorized' });\n    }\n    const isAdmin = await isProjectAdmin(req.user.id, new Types.ObjectId(validationData.projectId));\n    if (!isAdmin) return res.status(403).json({ message: 'Forbidden' });"
);

// Bug 30: getReflectionsByProject
content = content.replace(
  "const reflections = await EmployeeReflection.find({ projectId });",
  "if (!(await userCanAccessProject(req.user!.id, new Types.ObjectId(projectId), req.user!.role === 'admin'))) return res.status(403).json({ message: 'Forbidden' });\n    const reflections = await EmployeeReflection.find({ projectId });"
);

// Bug 31: getReflectionByEmployeeAndProject
content = content.replace(
  "const reflection = await EmployeeReflection.findOne({ employeeId, projectId });",
  "if (!(await userCanAccessProject(req.user!.id, new Types.ObjectId(projectId), req.user!.role === 'admin'))) return res.status(403).json({ message: 'Forbidden' });\n    const reflection = await EmployeeReflection.findOne({ employeeId, projectId });"
);

// Bug 32: getValidationsByEmployeeAndProject
content = content.replace(
  "const validations = await AdminValidation.find({ employeeId, projectId });",
  "if (!(await userCanAccessProject(req.user!.id, new Types.ObjectId(projectId), req.user!.role === 'admin'))) return res.status(403).json({ message: 'Forbidden' });\n    const validations = await AdminValidation.find({ employeeId, projectId });"
);

// Bug 33: getValidatedSkillsByEmployeeAndProject
content = content.replace(
  "const reflection = await EmployeeReflection.findOne({ employeeId, projectId });\n\n    if(!reflection) {",
  "if (!(await userCanAccessProject(req.user!.id, new Types.ObjectId(projectId), req.user!.role === 'admin'))) return res.status(403).json({ message: 'Forbidden' });\n    const reflection = await EmployeeReflection.findOne({ employeeId, projectId });\n\n    if(!reflection) {"
);

fs.writeFileSync('server/src/controllers/history.controller.ts', content);
console.log("history.controller.ts fixed");
