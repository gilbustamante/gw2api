if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

// TODO: implement database, save all the
// item names/info from market routes to 
// it, then pull from that instead of
// API request. Then cache all the other
// requests for like 5 mins. Boom

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

const express         = require('express');
const session         = require('express-session');
const cookieParser    = require('cookie-parser');
const path            = require('path');
const ejsMate         = require('ejs-mate');
const ExpressError    = require('./utils/ExpressError');
const flash           = require('connect-flash');
const app             = express();

// Scripts
const { convertGold } = require('./public/js/convertGold'); // Coin conversion
const { totalGold } = require('./public/js/totalGold'); // Total gold of orders
const { format } = require('timeago.js'); // Time formatting

// Requiring Routes
const achievementRoutes  = require('./routes/achievements');
const marketRoutes = require('./routes/market');
const apiRoutes    = require('./routes/api');
const bankRoutes = require('./routes/bank');

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
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // One week expiration
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
  res.locals.timeAgo = format;
  res.locals.totalGold = totalGold;
  next();
});

// Using Routes
app.use('/achievements', achievementRoutes);
app.use('/market', marketRoutes);
app.use('/api', apiRoutes);
app.use('/bank', bankRoutes);

// Temp Index
app.get('/', (req, res) => {
  res.render('index');
});

// 404 Error
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