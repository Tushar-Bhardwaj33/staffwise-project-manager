// At the very top of the file, before any imports that might read process.env
process.env.JWT_SECRET = "test-secret-key-for-vitest-only";

import { beforeAll, afterEach, afterAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../models/User.model.js";
import { Team } from "../models/Team.model.js";
import { Project } from "../models/Project.model.js";
import { Preference } from "../models/Preference.model.js";
import { ProjectDocument } from "../models/ProjectDocument.model.js";
import { Comment } from "../models/Comment.model.js";
import { AIQueryLog } from "../models/AIQueryLog.model.js";

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
    Comment.init(),
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