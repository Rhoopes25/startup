const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const db = require('./database.js');
const { peerProxy } = require('./peerProxy.js');


const app = express();
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Router
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Auth endpoints
apiRouter.post('/auth/create', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ msg: 'Email and password are required' });
    }
    
    const existingUser = await db.getUser(req.body.email);
    if (existingUser) {
      return res.status(409).send({ msg: 'Existing user' });
    }
    
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ msg: 'Error during registration' });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ msg: 'Email and password are required' });
    }
    
    const user = await db.getUser(req.body.email);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    // Generate new token
    user.token = uuid.v4();
    await db.updateUser(user);
    
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ msg: 'Error during login' });
  }
});

// For backward compatibility with your current React app
// These should be removed once frontend is updated
apiRouter.put('/auth', async (req, res) => {
  // This redirects to the login endpoint
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ msg: 'Email and password are required' });
    }
    
    const user = await db.getUser(req.body.email);
    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
    
    // Generate new token
    user.token = uuid.v4();
    await db.updateUser(user);
    
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ msg: 'Error during login' });
  }
});

apiRouter.post('/auth', async (req, res) => {
  // This redirects to the create endpoint
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ msg: 'Email and password are required' });
    }
    
    const existingUser = await db.getUser(req.body.email);
    if (existingUser) {
      return res.status(409).send({ msg: 'Existing user' });
    }
    
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ msg: 'Error during registration' });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  try {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      delete user.token;
      await db.updateUser(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send({ msg: 'Error during logout' });
  }
});

// Auth middleware
const verifyAuth = async (req, res, next) => {
  try {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).send({ msg: 'Error during auth verification' });
  }
};

// Protected endpoints
apiRouter.get('/user/me', verifyAuth, async (req, res) => {
  res.send({ email: req.user.email });
});

// Emotion endpoints
apiRouter.post('/emotions', verifyAuth, async (req, res) => {
  const emotion = { ...req.body, email: req.user.email };
  const savedEmotion = await db.addEmotion(emotion);
  res.status(201).send(savedEmotion);
});

apiRouter.get('/emotions', verifyAuth, async (req, res) => {
  const emotions = await db.getEmotions(req.user.email);
  res.send(emotions);
});

apiRouter.delete('/emotions', verifyAuth, async (req, res) => {
  const success = await db.deleteEmotion(req.user.email, req.body.date);
  success ? res.status(204).end() : res.status(404).end();
});

// Journal endpoints
apiRouter.post('/journals', verifyAuth, async (req, res) => {
  const journal = { ...req.body, email: req.user.email };
  const savedJournal = await db.addJournal(journal);
  res.status(201).send(savedJournal);
});

apiRouter.get('/journals', verifyAuth, async (req, res) => {
  const journals = await db.getJournals(req.user.email);
  res.send(journals);
});

apiRouter.delete('/journals', verifyAuth, async (req, res) => {
  const success = await db.deleteJournal(req.user.email, req.body.date);
  success ? res.status(204).end() : res.status(404).end();
});

// Helper functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    created: new Date()
  };
  await db.addUser(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return field === 'token' 
    ? db.getUserByToken(value) 
    : db.getUser(value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ type: err.name, message: err.message });
});

// Default route
app.use((_req, res) => {
  res.sendFile('index.html', { root: './public' });
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(server);

