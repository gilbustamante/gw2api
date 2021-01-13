const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const ejsMate = require('ejs-mate');

app.get('/', (req, res) => {
  res.render('index');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server listening on port 3000')
});