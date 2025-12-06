// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

console.log('🔍 DEBUG - MONGODB_URI value:', MONGODB_URI);
console.log('🔍 DEBUG - MONGODB_URI type:', typeof MONGODB_URI);
console.log('🔍 DEBUG - MONGODB_URI length:', MONGODB_URI?.length);

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // wichtig für Server Rendering
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
