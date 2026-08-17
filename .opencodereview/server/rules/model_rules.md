# Model Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard Mongoose practices, do NOT flag it.

**Rules:** 
- Only Services and Controllers should interact directly with Models.
- Models MUST NOT expose sensitive fields like `passwordHash` or `salt`. Use `.select('-passwordHash')` in queries or override the `toJSON` transform on the schema to automatically strip it.
- Never blindly pass `req.body` to a Model's `.create()` or `.findByIdAndUpdate()` method to avoid mass assignment/NoSQL injection vulnerabilities.

## Chain of Thought Reasoning
Before generating any comments for a Model file, think step-by-step:
1. Does this schema expose sensitive data (like passwords) without a `toJSON` transform or explicit `select: false`?
2. Are there any unsafe mass assignment vulnerabilities in Mongoose hooks?
3. Does the schema definition contain business logic that belongs in a Service?
4. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    return ret;
  }
});
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
const UserSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
});
// No toJSON transform and select: false is missing
```
*Your Expected Response:* Flag this. The `passwordHash` is exposed by default on queries, which is a critical security vulnerability. Use `select: false` or a `toJSON` transform to strip it.
