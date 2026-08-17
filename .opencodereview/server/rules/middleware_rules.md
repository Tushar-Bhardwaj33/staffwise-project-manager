# Middleware Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard Express middleware practices, do NOT flag it.

**Rules:** 
- Middlewares MUST always either call `next()` or send an HTTP response (e.g. `res.status(401).json(...)`). They must never leave a request hanging.
- If a middleware handles async code, it MUST wrap it in a `try/catch` or use an async wrapper to prevent unhandled promise rejections.
- Middlewares modifying the `req` object (like `req.user`) MUST ensure the types are properly defined or extended in a type declaration file, rather than using `any`.
- Authentication middlewares should return a `401 Unauthorized` if the token is missing/invalid.
- Authorization middlewares should return a `403 Forbidden` if the user lacks permissions.

## Chain of Thought Reasoning
Before generating any comments for a Middleware file, think step-by-step:
1. Is there any code path (like an error condition) that neither calls `next()` nor sends an HTTP response?
2. Is it missing a `try/catch` block for async operations?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
export const rbacMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id);
  if (user.role === 'admin') {
    next();
  }
};
```
*Your Expected Response:* Flag this. Missing `try/catch` for the async operation. Also, if the role is not 'admin', the request hangs forever because it neither calls `next()` nor returns a `403 Forbidden` response.
