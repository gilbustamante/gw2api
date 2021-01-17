const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');

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


app.get('/', (req, res) => {
  res.render('index');
});


app.listen(3000, () => {
  console.log('Server listening on port 3000')
});