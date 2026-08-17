# Service Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard service layer practices, do NOT flag it.

**Rules:** 
- Services must NOT know about Express `req` or `res` objects. They only take raw primitive parameters or DTOs.
- Services should throw typed, descriptive JavaScript `Error` objects, which the calling Controller will catch and translate into a 500 or 400 HTTP response.

## Chain of Thought Reasoning
Before generating any comments for a Service file, think step-by-step:
1. Is this service directly accessing Express `req` or `res` objects?
2. Is the service catching an error but not throwing it (swallowing the error without the controller knowing)?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
export const createUser = async (userData: CreateUserDTO) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("Email already in use");
  }
  return await User.create(userData);
};
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
export const createUser = async (req: Request, res: Response) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    res.status(400).json({ message: "Email in use" });
    return;
  }
  const user = await User.create(req.body);
  res.status(201).json(user);
};
```
*Your Expected Response:* Flag this. Services MUST NOT interact with Express `req` or `res` objects. They should take raw DTOs and throw errors for the controller to handle.
