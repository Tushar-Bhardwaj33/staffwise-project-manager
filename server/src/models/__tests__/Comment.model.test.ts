import { describe, it, expect } from "vitest";
import { Comment } from "../Comment.model.js";
import { User } from "../user.model.js";
import { Project } from "../project.model.js";

describe("Comment model", () => {
  it("creates a top-level comment with a title", async () => {
    const admin = await User.create({ name: "Admin", email: "a@test.com", passwordHash: "x", employeeId: "1", role: "admin" });
    const project = await Project.create({
      title: "P1", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    const comment = await Comment.create({
      project: project._id,
      author: admin._id,
      title: "Kickoff discussion",
      content: "Let's discuss timeline",
    });

    expect(comment.isPinned).toBe(false);
    expect(comment.upvotes).toEqual([]);
  });

  it("creates a reply without a title", async () => {
    const admin = await User.create({ name: "Admin2", email: "a2@test.com", passwordHash: "x", employeeId: "2", role: "admin" });
    const project = await Project.create({
      title: "P2", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    const parent = await Comment.create({ project: project._id, author: admin._id, title: "Topic", content: "Main" });
    const reply = await Comment.create({ project: project._id, author: admin._id, content: "A reply", parentComment: parent._id });

    expect(reply.title).toBeUndefined();
    expect(reply.parentComment?.toString()).toBe(parent._id.toString());
  });

  it("rejects missing content", async () => {
    const admin = await User.create({ name: "Admin3", email: "a3@test.com", passwordHash: "x", employeeId: "3", role: "admin" });
    const project = await Project.create({
      title: "P3", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    await expect(Comment.create({ project: project._id, author: admin._id, title: "No content" })).rejects.toThrow();
  });
});
