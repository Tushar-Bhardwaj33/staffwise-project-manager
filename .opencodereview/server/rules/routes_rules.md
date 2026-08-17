# Route Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard routing practices, do NOT flag it.

**Rules:** 
- Routes must contain ZERO business logic. They only handle HTTP method mapping.
- All mutating endpoints (POST, PUT, PATCH, DELETE) MUST be protected by `auth.middleware.ts` unless explicitly public (like login/register).
- Routes must pass request data to the appropriate Controller without modifying it.

## Chain of Thought Reasoning
Before generating any comments for a Route file, think step-by-step:
1. Are there any raw database queries or complex logic inside the route handler?
2. Is a POST, PUT, PATCH, or DELETE route missing the authentication middleware?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
const router = express.Router();
router.post('/', authMiddleware, createProjectController);
router.get('/:id', getProjectController);
export default router;
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
const router = express.Router();
router.post('/', async (req, res) => {
  const newProject = await Project.create(req.body);
  res.json(newProject);
});
```
*Your Expected Response:* Flag this. Routes must contain ZERO business logic. The logic must be moved to a controller/service. Also, it is a POST route missing `authMiddleware`.
