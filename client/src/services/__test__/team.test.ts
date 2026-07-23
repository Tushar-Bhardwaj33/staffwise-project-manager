import {describe, it, expect} from "vitest";
import {login} from "../auth.service.js";
// import {register} from "../auth.service.js";
// import {getCurrentUser} from "../auth.service.js";
import {getAllTeams} from "../team.service.js";

describe("Sample Test", () => {
    // it("should register a user", async () => {
    //     const user = {
    //         name : "Test User",
    //         email : "test@example.com",
    //         password : "password",
    //         employeeId : "12345"
    //     }

    //     const res = await register(user);
    //     expect(res.user).toBeDefined();
    //     expect(res.user.email).toBe(user.email);
    //     expect(res.user.name).toBe(user.name);
    //     expect(res.user.employeeId).toBe(user.employeeId);
    // })

    it("should login a user", async () => {
    const user = await login("tushar@staffwise.com", "password123");
    console.log("Login response:", user);
    expect(user).toBeDefined();
  })

    it("should get all teams", async () => {
        const teams = await getAllTeams();
        // console.log("All teams response:", teams);
        console.log("All teams response type:", typeof teams);
        expect(teams).toBeDefined();
    });

    // it("should give me current user", async () => {
    //     const user = await getCurrentUser();
    //     console.log("Current user response:", user);
    //     expect(user).toBeDefined();
    // })
});