const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios').default;
const ejsMate = require('ejs-mate');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/daily', async (req, res) => {
  let daily,
      quests = [],
      questIds = [],
      tomorrowQuests = [],
      tomorrowIds = [];
  try {
    // Current daily achievements
    const currentResponse = await axios.get('https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z')

    // Add all daily IDs to questIds array
    for (let questId of currentResponse.data.pve) {
      // If it's a low level quest, ignore
      if (questId.level.max < 80) { continue; }

      // If it's meant for non PoF users, ignore
      if (questId.required_access) {
        if (questId.required_access.condition === 'NoAccess') {
          continue;
        } else {
          questIds.push(questId.id);
          continue;
        }
      }
      questIds.push(questId.id);
    }

    // Get daily names from IDs
    daily = await axios.get(`https://api.guildwars2.com/v2/achievements?ids=${questIds.join()}`)
    quests = daily.data;

    // Tomorrow's daily achievements
    const tomorrowResponse = await axios.get('https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z')
    
    // Add all daily IDs to questIds array
    for (let tomorrowId of tomorrowResponse.data.pve) {
      // If it's a low level quest, ignore
      if (tomorrowId.level.max < 80) { continue; }

      // If it's meant for non PoF users, ignore
      if (tomorrowId.required_access) {
        if (tomorrowId.required_access.condition === 'NoAccess') {
          continue;
        } else {
          tomorrowIds.push(tomorrowId.id);
          continue;
        }
      }
      tomorrowIds.push(tomorrowId.id);
    }

    // Get daily names from IDs
    tomorrow = await axios.get(`https://api.guildwars2.com/v2/achievements?ids=${tomorrowIds.join()}`)
    tomorrowQuests = tomorrow.data;
    
  } catch (err) {
    console.log(err)
  }
  res.render('daily', { quests, tomorrowQuests });
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server listening on port 3000')
});