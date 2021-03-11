if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const app = express();

// Scripts
const { convertGold, convertNum } = require('./public/js/convertGold');
const { totalGold } = require('./public/js/totalGold');
const { format } = require('timeago.js'); // Time formatting

// Requiring Routes
const achievementRoutes = require('./routes/achievements');
const marketRoutes = require('./routes/market');
const apiRoutes = require('./routes/api');
const accountRoutes = require('./routes/account');

// Database setup
const database = process.env.DATABASE_URL || 'mongodb://localhost:27017/gw2';
mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Database connected.');
});

// App setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days expiration
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());

// Locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.convertGold = convertGold;
  res.locals.convertNum = convertNum;
  res.locals.totalGold = totalGold;
  res.locals.timeAgo = format;
  next();
});

// Using Routes
app.use('/achievements', achievementRoutes);
app.use('/market', marketRoutes);
app.use('/api', apiRoutes);
app.use('/account', accountRoutes);

// Temp Index
app.get('/', (req, res) => {
  res.render('index');
});

// 404
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // Default to 500
  if (!err.message) err.message = 'Something went wrong!';
  res.status(statusCode).render('error', { err });
})

port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server listening...')
});
