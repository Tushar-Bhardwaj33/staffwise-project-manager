# Validator Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard validation practices, do NOT flag it.

**Rules:** 
- Validators must use strict object validation (e.g. `.strict()` or `.strip()` in Zod) to prevent prototype pollution or NoSQL injection from unexpected extra fields.
- Validators should provide clear, user-friendly error messages for required fields.

## Chain of Thought Reasoning
Before generating any comments for a Validator file, think step-by-step:
1. Does the schema permit unknown keys, risking NoSQL injection or mass assignment?
2. Are error messages missing for strictly required fields?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).strict();
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
export const updateUserSchema = z.object({
  name: z.string(),
  age: z.number()
});
// Missing .strict() or .strip()
```
*Your Expected Response:* Flag this. The schema is not strict, meaning unexpected fields (like `role: 'admin'`) could be passed to the controller and injected into the database. Use `.strict()` or `.strip()`.
