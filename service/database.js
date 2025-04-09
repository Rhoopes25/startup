const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
let db;
let dbInitialized = false;

// Initialize database connection
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('emotionJournal');
    await db.command({ ping: 1 }); // Test the connection
    dbInitialized = true;
    console.log('Connected to MongoDB Atlas database');
    return db;
  } catch (ex) {
    console.error(`Unable to connect to database with ${url} because ${ex.message}`);
    // Don't exit the process, let the error be handled
    throw ex;
  }
}

// Start connecting right away
const connectionPromise = connectToDatabase();

// Helper to ensure DB is ready before any operation
async function withDb() {
  if (!dbInitialized) {
    await connectionPromise;
  }
  return db;
}

// Make sure we close the connection when the app is terminated
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
});

// User functions
async function getUser(field, value) {
  const database = await withDb();
  const query = {};
  query[field] = value;
  return await database.collection('user').findOne(query);
}

async function createUser(email, passwordHash) {
  const database = await withDb();
  const user = {
    email: email,
    password: passwordHash,
    token: null,
    created: new Date()
  };
  const result = await database.collection('user').insertOne(user);
  if (result.acknowledged) {
    return user;
  } else {
    throw new Error('Failed to create user');
  }
}

async function updateUserToken(email, token) {
  const database = await withDb();
  const result = await database.collection('user').updateOne(
    { email: email },
    { $set: { token: token, lastLogin: new Date() } }
  );
  if (!result.acknowledged) {
    throw new Error('Failed to update user token');
  }
  return result.modifiedCount > 0;
}

async function removeUserToken(email) {
  const database = await withDb();
  const result = await database.collection('user').updateOne(
    { email: email },
    { $unset: { token: "" } }
  );
  return result.modifiedCount > 0;
}

// Emotion functions
async function addEmotion(emotion) {
  const database = await withDb();
  // Ensure we have all the fields from the frontend
  if (!emotion.emotion && emotion.rating) {
    emotion.emotion = emotion.rating; // For compatibility with frontend
  }
  
  // Store the original date string as-is for exact matching during delete
  const dateString = emotion.date;
  
  // Also create a Date object version for proper date handling
  emotion.createdAt = new Date();
  
  const result = await database.collection('emotion').insertOne(emotion);
  if (!result.acknowledged) {
    throw new Error('Failed to add emotion');
  }
  return emotion;
}

async function getEmotions(email) {
  const database = await withDb();
  // Sort by date in descending order (newest first)
  return await database.collection('emotion').find({ email: email }).sort({ date: -1 }).toArray();
}

async function deleteEmotion(email, date) {
  const database = await withDb();
  // Your frontend sends the exact date string, so we'll match it exactly
  const result = await database.collection('emotion').deleteOne({ 
    email: email, 
    date: date 
  });
  
  if (!result.acknowledged) {
    throw new Error('Failed to delete emotion');
  }
  return result.deletedCount > 0;
}

// Journal functions
async function addJournal(journal) {
  const database = await withDb();
  // Store the original date string as-is for exact matching during delete
  const dateString = journal.date;
  
  // Also create a Date object version for proper date handling
  journal.createdAt = new Date();
  
  const result = await database.collection('journal').insertOne(journal);
  if (!result.acknowledged) {
    throw new Error('Failed to add journal');
  }
  return journal;
}

async function getJournals(email) {
  const database = await withDb();
  // Sort by date in descending order (newest first)
  return await database.collection('journal').find({ email: email }).sort({ date: -1 }).toArray();
}

async function deleteJournal(email, date) {
  const database = await withDb();
  // Your frontend sends the exact date string, so we'll match it exactly
  const result = await database.collection('journal').deleteOne({
    email: email, 
    date: date
  });
  
  if (!result.acknowledged) {
    throw new Error('Failed to delete journal');
  }
  return result.deletedCount > 0;
}

module.exports = {
  getUser,
  createUser,
  updateUserToken,
  removeUserToken,
  addEmotion,
  getEmotions,
  deleteEmotion,
  addJournal,
  getJournals,
  deleteJournal
};