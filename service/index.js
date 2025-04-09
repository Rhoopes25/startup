const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const db = require('./database');

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
    if (await db.getUser(req.body.email)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await createUser(req.body.email, req.body.password);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
    }
  } catch (err) {
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = await db.getUser(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await db.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const token = req.cookies[authCookieName];
  if (token) {
    const user = await db.getUserByToken(token);
    if (user) {
      user.token = null;
      await db.updateUser(user);
    }
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Auth middleware
const verifyAuth = async (req, res, next) => {
  const token = req.cookies[authCookieName];
  const user = await db.getUserByToken(token);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Protected endpoints
apiRouter.get('/user/me', verifyAuth, async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await db.getUserByToken(token);
  res.send({ email: user.email });
});

apiRouter.post('/emotions', verifyAuth, async (req, res) => {
  try {
    const token = req.cookies[authCookieName];
    const user = await db.getUserByToken(token);
    const emotion = { ...req.body, email: user.email };
    const savedEmotion = await db.addEmotion(emotion);
    res.status(201).send(savedEmotion);
  } catch (err) {
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.get('/emotions', verifyAuth, async (req, res) => {
  try {
    const token = req.cookies[authCookieName];
    const user = await db.getUserByToken(token);
    const emotions = await db.getEmotions(user.email);
    res.send(emotions);
  } catch (err) {
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.delete('/emotions', verifyAuth, async (req, res) => {
  try {
    const token = req.cookies[authCookieName];
    const user = await db.getUserByToken(token);
    const success = await db.deleteEmotion(user.email, req.body.date);
    success ? res.status(204).end() : res.status(404).end();
  } catch (err) {
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// (Similar protected endpoints for journals would go here)

// Helper functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email,
    password: passwordHash,
    token: uuid.v4(),
    created: new Date()
  };
  await db.addUser(user);
  return user;
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/'
  });
}

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Default route
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});