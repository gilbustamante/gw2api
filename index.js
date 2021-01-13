const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios').default;
const ejsMate = require('ejs-mate');

app.get('/', async (req, res) => {
  let daily;
  try {
    const response = await axios.get('https://api.guildwars2.com/v2/achievements/daily')
    const dailyId = response.data.pve[0].id;
    daily = await axios.get(`https://api.guildwars2.com/v2/achievements?ids=${dailyId}`)
    console.log(daily.data[0])
  } catch (err) {
    console.log(err)
  }
  res.render('index', { daily: daily.data[0] });
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server listening on port 3000')
});