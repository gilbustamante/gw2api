const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

// Requiring Routes
const dailyRoutes = require('./routes/daily');
const marketRoutes = require('./routes/market');

// Using Routes
app.use('/daily', dailyRoutes);
app.use('/market', marketRoutes);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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