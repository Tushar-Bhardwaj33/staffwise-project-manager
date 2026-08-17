// At the very top of the file, before any imports that might read process.env
process.env.JWT_SECRET = "test-secret-key-for-vitest-only";

import { beforeAll, afterEach, afterAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../models/user.model.js";
import { Team } from "../models/team.model.js";
import { Project } from "../models/project.model.js";
import { Preference } from "../models/preference.model.js";
import { ProjectDocument } from "../models/projectDocument.model.js";
// import { Comment } from "../models/Comment.model.js";
import { AIQueryLog } from "../models/aiQueryLog.model.js";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await Promise.all([
    User.init(),
    Team.init(),
    Project.init(),
    Preference.init(),
    ProjectDocument.init(),
    // Comment.init(),
    AIQueryLog.init(),
  ]);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
