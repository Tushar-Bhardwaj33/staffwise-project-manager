# Controller Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard MERN controller practices, do NOT flag it.

**Rules:** 
- Controllers must assume that if a middleware is attached to their route, the data is safe and the user is authenticated. 
- Controllers must NOT manually check for null properties on `req.user` if the route is protected.
- Controllers must NOT contain complex business logic or complex database aggregation pipelines. 
- Every controller function MUST be wrapped in a `try/catch` block.
- Controllers MUST return standard REST HTTP status codes (200, 201, 400 for validation errors, 401 for auth, 403 for RBAC, 404 for not found, 409 for conflicts, 500 for server errors).
- Controllers MUST NOT use `any` or `as any` type assertions. Use explicit interfaces.

## Chain of Thought Reasoning
Before generating any comments for a Controller file, think step-by-step:
1. Does this controller contain complex business logic that should be in a Service?
2. Is the controller manually validating data that should be handled by a schema validator middleware?
3. Is it missing a `try/catch` block for async operations?
4. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
```
*Your Expected Response:* "No issues found." (Do not flag the lack of `req.user` check if handled by middleware. Do not flag the `try/catch` as unnecessary.)

*Example 2 (Buggy/Violating Code):*
```typescript
export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json(user);
};
```
*Your Expected Response:* Flag this. Missing `try/catch` block for the async database call.
