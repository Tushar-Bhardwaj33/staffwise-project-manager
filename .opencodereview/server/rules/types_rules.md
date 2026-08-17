# Types Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code strictly contains type definitions, do NOT flag it.

**Rules:** 
- Type files (`*.types.ts`) MUST ONLY contain TypeScript `interface`, `type`, `enum`, or ambient declarations.
- They MUST NOT contain any runtime JavaScript logic (like functions, classes, or variable declarations), other than `enum` which has a runtime equivalent.
- Avoid circular dependencies between type files.
- Export all interfaces so they can be consumed by other layers (Controllers, Services, etc.).

## Chain of Thought Reasoning
Before generating any comments for a Types file, think step-by-step:
1. Are there any actual JavaScript function declarations or variable assignments (other than `enum`)?
2. Are the interfaces missing the `export` keyword?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
export interface JwtPayload {
  userId: string;
  role: 'admin' | 'employee';
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
export interface AppConfig {
  port: number;
}

export const loadConfig = (): AppConfig => {
  return { port: 3000 };
};
```
*Your Expected Response:* Flag this. Type files must ONLY contain TypeScript declarations, not runtime functions like `loadConfig`.
