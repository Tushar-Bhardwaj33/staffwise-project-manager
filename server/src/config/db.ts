import mongoose from "mongoose";
import dotenv from "dotenv"; 
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not set in .env");

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;