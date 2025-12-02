import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
const envContent = readFileSync(join(__dirname, '../.env'), 'utf-8');
const envLine = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='));
const MONGODB_URI = envLine.substring('MONGODB_URI='.length).trim();

async function createIndexes() {
  try {
    console.log('MongoDB URI:', MONGODB_URI);
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const db = mongoose.connection.db;
    const collection = db.collection('productList');

    console.log('Creating indexes...');

    // Single field indexes
    await collection.createIndex({ hidden: 1 });
    console.log('✓ Created index on hidden');

    await collection.createIndex({ category: 1 });
    console.log('✓ Created index on category');

    await collection.createIndex({ creatorName: 1 });
    console.log('✓ Created index on creatorName');

    // Compound indexes for common query patterns
    await collection.createIndex({ hidden: 1, category: 1 });
    console.log('✓ Created compound index on hidden + category');

    await collection.createIndex({ hidden: 1, creatorName: 1 });
    console.log('✓ Created compound index on hidden + creatorName');

    console.log('\nAll indexes created successfully!');
    console.log('\nCurrent indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)}`);
    });

  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

createIndexes();
