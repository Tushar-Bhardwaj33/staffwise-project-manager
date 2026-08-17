# Test Rules

**CRITICAL DIRECTIVE FOR AI REVIEWER:** 
It is 100% acceptable to report **0 issues**. If the code follows standard testing practices, do NOT flag it.

**Rules:** 
- Tests MUST isolate the logic they are testing (using mocks for external dependencies like databases or APIs where appropriate, unless it's an integration test).
- Tests MUST clean up after themselves (e.g., clearing the database in `afterEach` or `afterAll` if using a real DB).
- They MUST use descriptive `describe` and `it` blocks that clearly explain what behavior is being tested.
- They MUST contain valid assertions (`expect()`) that accurately verify the expected outcome.

## Chain of Thought Reasoning
Before generating any comments for a Test file, think step-by-step:
1. Is the test interacting with an external database without cleaning up in an `afterEach` or `afterAll` hook?
2. Is the test missing assertions (`expect`), meaning it only verifies that the code doesn't crash?
3. If the answer to all is NO, conclude with: "No issues found."

## Few-Shot Examples for Calibration

*Example 1 (Clean Code):*
```typescript
describe('Calculator', () => {
  it('should add two positive numbers correctly', () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });
});
```
*Your Expected Response:* "No issues found." 

*Example 2 (Buggy/Violating Code):*
```typescript
describe('Database User Creation', () => {
  it('should create a user', async () => {
    await User.create({ email: 'test@test.com', name: 'Test' });
    // No expect statement!
    // No database cleanup!
  });
});
```
*Your Expected Response:* Flag this. The test is missing assertions (`expect`) to verify the outcome, and it leaves a test user in the database without cleaning up.
