const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// The users and ratings will be stored in memory for this example
let users = [];
let ratings = [];  // This will store ratings per user

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());  // Middleware to parse JSON body
app.use(cookieParser());  // Middleware for parsing cookies
app.use(express.static('public'));  // Serve static files (e.g., front-end)

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// User authentication routes (same as your original code)
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authenticated
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Get ratings (for the logged-in user)
apiRouter.get('/ratings', verifyAuth, (req, res) => {
  const user = findUser('token', req.cookies[authCookieName]);
  const userRatings = ratings.filter(rating => rating.email === user.email);
  res.send(userRatings);
});

// Submit a new rating
apiRouter.post('/rating', verifyAuth, (req, res) => {
  const user = findUser('token', req.cookies[authCookieName]);
  const newRating = {
    email: user.email,
    emotion: req.body.emotion,
    date: new Date().toISOString(),
  };
  ratings.push(newRating);
  res.send({ message: 'Rating submitted', rating: newRating });
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Helper function to create a user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);
  return user;
}

// Helper function to find a user by email or token
async function findUser(field, value) {
  return users.find((u) => u[field] === value);
}

// Set the auth cookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
