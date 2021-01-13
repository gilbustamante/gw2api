const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios').default;
const ejsMate = require('ejs-mate');

app.get('/', async (req, res) => {
  let daily;
  let quests;
  let questIds = [];
  try {
    const response = await axios.get('https://api.guildwars2.com/v2/achievements/daily')
    for (let questId of response.data.pve) {
      questIds.push(questId.id);
    }
    daily = await axios.get(`https://api.guildwars2.com/v2/achievements?ids=${questIds.join()}`)
    quests = daily.data;
    console.log(quests[0].tiers.count)
  } catch (err) {
    console.log(err)
  }
  res.render('index', { quests });
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server listening on port 3000')
});