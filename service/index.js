const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Create a router for API endpoints
const apiRouter = express.Router();

// Auth endpoints
apiRouter.post('/auth', async (req, res) => {
  if (await getUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user);
    res.send({ email: user.email });
  }
});

apiRouter.put('/auth', async (req, res) => {
  const user = await getUser('email', req.body.email);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.delete('/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }
  res.send({});
});

apiRouter.get('/user/me', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// User management functions
const users = [];
let emotions = [];
let journals = [];

// POST a new emotion
apiRouter.post('/emotions', (req, res) => {
  const newEmotion = req.body;
  emotions.push(newEmotion);
  res.status(201).json(newEmotion);
});

// GET emotions for a user
apiRouter.get('/emotions', (req, res) => {
  const userEmail = req.query.email; // Filter by user email
  const userEmotions = emotions.filter(e => e.email === userEmail);
  res.send(userEmotions);
});

// DELETE an emotion
apiRouter.delete('/emotions', (req, res) => {
  const { email, date } = req.body;
  emotions = emotions.filter(e => e.email !== email || e.date !== date);
  res.status(204).end();
});

// POST a new journal
apiRouter.post('/journals', (req, res) => {
  const newJournal = req.body;
  journals.push(newJournal);
  res.status(201).json(newJournal);
});

// GET journals for a user
apiRouter.get('/journals', (req, res) => {
  const userEmail = req.query.email; // Filter by user email
  const userJournals = journals.filter(j => j.email === userEmail);
  res.send(userJournals);
});

// DELETE a journal
apiRouter.delete('/journals', (req, res) => {
  const { email, date } = req.body;
  journals = journals.filter(j => j.email !== email || j.date !== date);
  res.status(204).end();
});

// Helper functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
  };
  users.push(user);
  return user;
}

async function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}

function setAuthCookie(res, user) {
  user.token = uuid.v4();
  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
}

// Start the server
app.use('/api', apiRouter);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});