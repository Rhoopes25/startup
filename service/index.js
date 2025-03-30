const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('./database.js');
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Create a router for API endpoints
const apiRouter = express.Router();

// Auth endpoints
apiRouter.post('/auth', async (req, res) => {
  try {
    if (await db.getUser('email', req.body.email)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      const user = await db.createUser(req.body.email, passwordHash);
      setAuthCookie(res, user);
      res.send({ email: user.email });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ msg: 'Error creating user' });
  }
});

apiRouter.put('/auth', async (req, res) => {
  try {
    const user = await db.getUser('email', req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      setAuthCookie(res, user);
      res.send({ email: user.email });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error authenticating:', error);
    res.status(500).send({ msg: 'Error authenticating' });
  }
});

apiRouter.delete('/auth', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (user) {
      await clearAuthCookie(res, user);
    }
    res.send({});
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).send({ msg: 'Error logging out' });
  }
});

apiRouter.get('/user/me', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (user) {
      res.send({ email: user.email });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send({ msg: 'Error getting user' });
  }
});

// Emotions endpoints
apiRouter.post('/emotions', async (req, res) => {
  try {
    const newEmotion = req.body;
    // Allow the emotion to be saved without token validation
    // This matches your current frontend implementation using localStorage
    await db.addEmotion(newEmotion);
    res.status(201).json(newEmotion);
  } catch (error) {
    console.error('Error adding emotion:', error);
    res.status(500).send({ msg: 'Error adding emotion' });
  }
});

apiRouter.get('/emotions', async (req, res) => {
  try {
    const userEmail = req.query.email;
    // Allow getting emotions without token validation
    // This matches your current frontend implementation using localStorage
    if (!userEmail) {
      return res.status(400).send({ msg: 'Email parameter is required' });
    }
    const userEmotions = await db.getEmotions(userEmail);
    res.send(userEmotions);
  } catch (error) {
    console.error('Error getting emotions:', error);
    res.status(500).send({ msg: 'Error getting emotions' });
  }
});

apiRouter.delete('/emotions', async (req, res) => {
  try {
    const { email, date } = req.body;
    // Allow deleting emotions without token validation
    // This matches your current frontend implementation using localStorage
    if (!email || !date) {
      return res.status(400).send({ msg: 'Email and date are required' });
    }
    
    await db.deleteEmotion(email, date);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting emotion:', error);
    res.status(500).send({ msg: 'Error deleting emotion' });
  }
});

// Journals endpoints
apiRouter.post('/journals', async (req, res) => {
  try {
    const newJournal = req.body;
    // Allow the journal to be saved without token validation
    // This matches your current frontend implementation using localStorage
    await db.addJournal(newJournal);
    res.status(201).json(newJournal);
  } catch (error) {
    console.error('Error adding journal:', error);
    res.status(500).send({ msg: 'Error adding journal' });
  }
});

apiRouter.get('/journals', async (req, res) => {
  try {
    const userEmail = req.query.email;
    // Allow getting journals without token validation
    // This matches your current frontend implementation using localStorage
    if (!userEmail) {
      return res.status(400).send({ msg: 'Email parameter is required' });
    }
    const userJournals = await db.getJournals(userEmail);
    res.send(userJournals);
  } catch (error) {
    console.error('Error getting journals:', error);
    res.status(500).send({ msg: 'Error getting journals' });
  }
});

apiRouter.delete('/journals', async (req, res) => {
  try {
    const { email, date } = req.body;
    // Allow deleting journals without token validation
    // This matches your current frontend implementation using localStorage
    if (!email || !date) {
      return res.status(400).send({ msg: 'Email and date are required' });
    }
    
    await db.deleteJournal(email, date);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).send({ msg: 'Error deleting journal' });
  }
});

// Helper functions
async function setAuthCookie(res, user) {
  const token = uuid.v4();
  await db.updateUserToken(user.email, token);
  res.cookie('token', token, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

async function clearAuthCookie(res, user) {
  await db.removeUserToken(user.email);
  res.clearCookie('token');
}

// Start the server
app.use('/api', apiRouter);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});