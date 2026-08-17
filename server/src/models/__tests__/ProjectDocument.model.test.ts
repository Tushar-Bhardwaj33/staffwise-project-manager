import { describe, it, expect } from "vitest";
import { ProjectDocument } from "../projectDocument.model.js";
import { User } from "../user.model.js";
import { Project } from "../project.model.js";

describe("ProjectDocument model", () => {
  it("creates a valid document record", async () => {
    const admin = await User.create({ name: "Admin", email: "a@test.com", passwordHash: "x", employeeId: "1", role: "admin" });
    const project = await Project.create({
      title: "P1", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    const doc = await ProjectDocument.create({
      project: project._id,
      title: "Requirements Doc",
      r2Key: "projects/p1/req.pdf",
      filename: "req.pdf",
      mimeType: "application/pdf",
      size: 10240,
      uploadedBy: admin._id,
    });

    expect(doc.filename).toBe("req.pdf");
    expect(doc.size).toBe(10240);
  });

  it("rejects missing r2Key", async () => {
    const admin = await User.create({ name: "Admin2", email: "a2@test.com", passwordHash: "x", employeeId: "2", role: "admin" });
    const project = await Project.create({
      title: "P2", description: "d", type: "company",
      startDate: new Date(), endDate: new Date(Date.now() + 86400000), createdBy: admin._id,
    });

    await expect(
      ProjectDocument.create({
        project: project._id,
        title: "No Key",
        filename: "x.pdf",
        mimeType: "application/pdf",
        size: 100,
        uploadedBy: admin._id,
      })
    ).rejects.toThrow();
  });
});
