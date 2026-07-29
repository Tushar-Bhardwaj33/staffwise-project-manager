import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staffwise');
    console.log("Connected to MongoDB");
    
    // Check if there are any reflections
    const { EmployeeReflection, AdminValidation } = await import('./server/src/models/History.model.js');
    const reflections = await EmployeeReflection.find({});
    console.log("Reflections in DB:", reflections.length);
    
    const validations = await AdminValidation.find({});
    console.log("Validations in DB:", validations.length);

  } catch (error) {
    console.error("Test error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

test();
