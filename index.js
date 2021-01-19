if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express         = require('express');
const session         = require('express-session');
const cookieParser    = require('cookie-parser');
const path            = require('path');
const ejsMate         = require('ejs-mate');
const ExpressError    = require('./utils/ExpressError');
const flash           = require('connect-flash');
const { convertGold } = require('./public/js/convertGold');
const app             = express();

// Requiring Routes
const dailyRoutes  = require('./routes/daily');
const marketRoutes = require('./routes/market');
const apiRoutes    = require('./routes/api');

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
  next();
});

// Using Routes
app.use('/daily', dailyRoutes);
app.use('/market', marketRoutes);
app.use('/api', apiRoutes);

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

app.listen(3000, () => {
  console.log('Server listening on port 3000')
});