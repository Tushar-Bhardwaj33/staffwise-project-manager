# Util Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard utility function practices, do NOT flag it.

**Rules:** 
- Utility functions MUST be pure and stateless whenever possible. They should return the same output for the same input.
- They MUST NOT rely on or mutate global state or request/response objects (unless explicitly designed to, e.g., a header parser, which still shouldn't mutate).
- They MUST NOT contain business logic tied to the database or models. Database logic belongs in Services.
- All inputs and outputs MUST be strongly typed. Avoid the use of `any`.

## Chain of Thought Reasoning
Before generating any comments for a Util file, think step-by-step:
1. Does this function interact with the database (Mongoose models)?
2. Does this function mutate global state or rely on side effects?
3. Are the inputs/outputs typed as `any`?
4. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
export const calculateAge = (birthdate: Date): number => {
  const diff = Date.now() - birthdate.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
import { User } from '../models/user.model';

export const checkUserExists = async (email: any) => {
  const user = await User.findOne({ email });
  return !!user;
};
```
*Your Expected Response:* Flag this. Utility functions MUST NOT contain database logic (this belongs in a Service). Furthermore, the `email` argument is typed as `any`.
