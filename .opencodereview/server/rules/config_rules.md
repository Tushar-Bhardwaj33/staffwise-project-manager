# Config Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard configuration practices, do NOT flag it.

**Rules:** 
- Configuration files MUST load their secrets from environment variables (e.g., `process.env.DB_URI`).
- Configs MUST NEVER hardcode sensitive information like API keys, database credentials, or secret tokens.
- They should provide sensible defaults for non-sensitive values if an environment variable is missing (where applicable).
- Errors in configuration (like a missing required environment variable) should fail fast and throw an explicit error on startup.

## Chain of Thought Reasoning
Before generating any comments for a Config file, think step-by-step:
1. Is there a hardcoded string that looks like a password, secret, or API key?
2. Does the config ignore missing critical environment variables instead of throwing an error?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is missing.");
}
export const config = { jwtSecret };
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
export const config = {
  dbUri: process.env.DB_URI || "mongodb://admin:password123@localhost:27017/mydb"
};
```
*Your Expected Response:* Flag this. The configuration hardcodes database credentials as a fallback. Secrets MUST NEVER be hardcoded.
