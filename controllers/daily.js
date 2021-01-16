const axios = require('axios').default;
const filterAchievements = require('../utils/filterAchievements');

// Make API Call And Display
// module.exports.displayDailies = async (req, res) => {
//   let daily,
//       quests = [],
//       questIds = [],
//       tomorrowQuests = [],
//       tomorrowIds = [];
//   try {
//     // Current daily achievements
//     const currentResponse = await axios.get('https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z')

//     // Add all daily IDs to questIds array
//     for (let questId of currentResponse.data.pve) {
//       // If it's a low level quest, ignore
//       if (questId.level.max < 80) { continue; }

//       // If it's meant for non PoF users, ignore
//       if (questId.required_access) {
//         if (questId.required_access.condition === 'NoAccess') {
//           continue;
//         } else {
//           questIds.push(questId.id);
//           continue;
//         }
//       }
//       questIds.push(questId.id);
//     }

//     // Get daily names from IDs
//     daily = await axios.get(`https://api.guildwars2.com/v2/achievements?ids=${questIds.join()}`)
//     quests = daily.data;

//     // Tomorrow's daily achievements
//     const tomorrowResponse = await axios.get('https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z')
    
//     // Add all daily IDs to questIds array
//     for (let tomorrowId of tomorrowResponse.data.pve) {
//       // If it's a low level quest, ignore
//       if (tomorrowId.level.max < 80) { continue; }

//       // If it's meant for non PoF users, ignore
//       if (tomorrowId.required_access) {
//         if (tomorrowId.required_access.condition === 'NoAccess') {
//           continue;
//         } else {
//           tomorrowIds.push(tomorrowId.id);
//           continue;
//         }
//       }
//       tomorrowIds.push(tomorrowId.id);
//     }

//     // Get daily names from IDs
//     tomorrow = await axios.get(`https://api.guildwars2.com/v2/achievements?ids=${tomorrowIds.join()}`)
//     tomorrowQuests = tomorrow.data;

//   } catch (err) {
//     console.log(err)
//   }
//   res.render('daily', { quests, tomorrowQuests });
// };

// Globals
let achievements = {};
let categories = {};
let dailies = {};
const dailyUrl = 'https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z';
const dailyTomorrowUrl = 'https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z'
const dailyLookupUrl = 'https://api.guildwars2.com/v2/achievements?ids='

module.exports.dailyBeta = async (req, res) => {
  let achievementsBuffer = [];
  categories = {
    'pve': [],
    'pvp': [],
    'wvw': [],
    'fractals': [],
    'special': []
  }
  try {
    const result = await axios.get(dailyUrl);
    dailies = result.data;

    // PvE
    for (let achievement of dailies.pve) {
      const id = filterAchievements(achievement)
      if (id) {
        achievementsBuffer.push(id)
        categories.pve.push(id)
      }
    }

    // PvP
    for (let achievement of dailies.pvp) {
      achievementsBuffer.push(achievement.id)
      categories.pvp.push(achievement.id)
    }

    // WvW
    for (let achievement of dailies.wvw) {
      achievementsBuffer.push(achievement.id)
      categories.wvw.push(achievement.id)
    }

    // Fractals
    for (let achievement of dailies.fractals) {
      achievementsBuffer.push(achievement.id)
      categories.fractals.push(achievement.id)
    }

    // Special Events
    for (let achievement of dailies.special) {
      achievementsBuffer.push(achievement.id)
      categories.special.push(achievement.id)
    }

    const dailiesDetails = await axios.get(
      dailyLookupUrl + achievementsBuffer.join());

    achievements = dailiesDetails.data;

    // Maybe move this to a function somewhere else
    achievementsDict = {};
    for (let achievement of achievements) {
      const achievementID = achievement.id;
      achievementsDict[achievementID] = achievement;
    }

  } catch (err) {
    console.log(err);
  }
  res.render('daily', { achievementsDict, categories });
}