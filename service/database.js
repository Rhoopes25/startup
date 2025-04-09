const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('emotionJournal');

// Collections
const userCollection = db.collection('user');
const emotionCollection = db.collection('emotion');
const journalCollection = db.collection('journal');

// Test connection immediately
(async function testConnection() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB Atlas');
  } catch (ex) {
    console.error(`Connection failed: ${ex.message}`);
    process.exit(1);
  }
})();

// User functions
async function getUser(email) {
  return await userCollection.findOne({ email });
}

async function getUserByToken(token) {
  return await userCollection.findOne({ token });
}

async function addUser(user) {
  const result = await userCollection.insertOne(user);
  if (!result.acknowledged) {
    throw new Error('Failed to create user');
  }
  return user;
}

async function updateUser(user) {
  const result = await userCollection.updateOne(
    { email: user.email },
    { $set: user }
  );
  if (!result.acknowledged) {
    throw new Error('Failed to update user');
  }
  return result.modifiedCount > 0;
}

// Emotion functions
async function addEmotion(emotion) {
  emotion.createdAt = new Date();
  const result = await emotionCollection.insertOne(emotion);
  if (!result.acknowledged) {
    throw new Error('Failed to add emotion');
  }
  return emotion;
}

async function getEmotions(email) {
  return await emotionCollection.find({ email }).sort({ date: -1 }).toArray();
}

async function deleteEmotion(email, date) {
  const result = await emotionCollection.deleteOne({ email, date });
  if (!result.acknowledged) {
    throw new Error('Failed to delete emotion');
  }
  return result.deletedCount > 0;
}

// Journal functions
async function addJournal(journal) {
  journal.createdAt = new Date();
  const result = await journalCollection.insertOne(journal);
  if (!result.acknowledged) {
    throw new Error('Failed to add journal');
  }
  return journal;
}

async function getJournals(email) {
  return await journalCollection.find({ email }).sort({ date: -1 }).toArray();
}

async function deleteJournal(email, date) {
  const result = await journalCollection.deleteOne({ email, date });
  if (!result.acknowledged) {
    throw new Error('Failed to delete journal');
  }
  return result.deletedCount > 0;
}

// Close connection on process termination
process.on('SIGINT', async () => {
  await client.close();
  console.log('Database connection closed');
  process.exit(0);
});

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addEmotion,
  getEmotions,
  deleteEmotion,
  addJournal,
  getJournals,
  deleteJournal
};