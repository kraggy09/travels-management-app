import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Exits the process immediately if the connection fails so the
 * problem is visible at startup rather than at the first query.
 */
const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // give up after 5 s if MongoDB is unreachable
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌  MongoDB connection error: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
