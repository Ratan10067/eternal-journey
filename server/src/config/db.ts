import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[Database] MONGODB_URI is not configured. Database-backed API routes are unavailable.');
    return false;
  }
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB connected successfully (${mongoose.connection.host || 'configured host'}).`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Database-backed API routes are unavailable.`);
    return false;
  }
};
