const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Import the database module
const db = require('./database');

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
    console.error('Error during registration:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.put('/auth', async (req, res) => {
  try {
    const user = await db.getUser('email', req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = uuid.v4();
      await db.updateUserToken(user.email, token);
      setAuthCookie(res, { ...user, token });
      res.send({ email: user.email });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.delete('/auth', async (req, res) => {
  try {
    const token = req.cookies['token'];
    if (token) {
      const user = await db.getUser('token', token);
      if (user) {
        await db.removeUserToken(user.email);
      }
    }
    res.clearCookie('token');
    res.send({});
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send({ msg: 'Internal server error' });
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
    console.error('Error getting user profile:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// POST a new emotion
apiRouter.post('/emotions', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const newEmotion = req.body;
    newEmotion.email = user.email; // Ensure the email is from the authenticated user
    
    const savedEmotion = await db.addEmotion(newEmotion);
    res.status(201).json(savedEmotion);
  } catch (error) {
    console.error('Error adding emotion:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// GET emotions for a user
apiRouter.get('/emotions', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const emotions = await db.getEmotions(user.email);
    res.send(emotions);
  } catch (error) {
    console.error('Error getting emotions:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// DELETE an emotion
apiRouter.delete('/emotions', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const { date } = req.body;
    const success = await db.deleteEmotion(user.email, date);
    
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).send({ msg: 'Emotion not found' });
    }
  } catch (error) {
    console.error('Error deleting emotion:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// POST a new journal
apiRouter.post('/journals', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const newJournal = req.body;
    newJournal.email = user.email; // Ensure the email is from the authenticated user
    
    const savedJournal = await db.addJournal(newJournal);
    res.status(201).json(savedJournal);
  } catch (error) {
    console.error('Error adding journal:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// GET journals for a user
apiRouter.get('/journals', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const journals = await db.getJournals(user.email);
    res.send(journals);
  } catch (error) {
    console.error('Error getting journals:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// DELETE a journal
apiRouter.delete('/journals', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await db.getUser('token', token);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const { date } = req.body;
    const success = await db.deleteJournal(user.email, date);
    
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).send({ msg: 'Journal not found' });
    }
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// Helper function for setting auth cookie
function setAuthCookie(res, user) {
  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

// Start the server
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});