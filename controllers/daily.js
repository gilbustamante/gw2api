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
// Today
let todayAchievements = {};
let todayCategories = {};
let todayDailies = {};
// Tomorrow
let tomorrowAchievements = {};
let tomorrowCategories = {};
let tomorrowDailies = {};
const dailyUrl = 'https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z';
const dailyTomorrowUrl = 'https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z'
const dailyLookupUrl = 'https://api.guildwars2.com/v2/achievements?ids='

module.exports.dailyBeta = async (req, res) => {
  let todayBuffer = [];
  let tomorrowBuffer = [];
  todayCategories = {
    'pve': [],
    'pvp': [],
    'wvw': [],
    'fractals': [],
    'special': []
  }

  tomorrowCategories = {
    'pve': [],
    'pvp': [],
    'wvw': [],
    'fractals': [],
    'special': []
  }

  try {
    // Request Today's Dailies
    const today = await axios.get(dailyUrl);
    todayDailies = today.data;

    // Request Tomorrow's Dailies
    const tomorrow = await axios.get(dailyTomorrowUrl);
    tomorrowDailies = tomorrow.data;

    // Today - PvE
    for (let achievement of todayDailies.pve) {
      const id = filterAchievements(achievement)
      if (id) {
        todayBuffer.push(id)
        todayCategories.pve.push(id)
      }
    }

    // Today - PvP
    for (let achievement of todayDailies.pvp) {
      todayBuffer.push(achievement.id)
      todayCategories.pvp.push(achievement.id)
    }

    // Today - WvW
    for (let achievement of todayDailies.wvw) {
      todayBuffer.push(achievement.id)
      todayCategories.wvw.push(achievement.id)
    }

    // Today - Fractals
    for (let achievement of todayDailies.fractals) {
      todayBuffer.push(achievement.id)
      todayCategories.fractals.push(achievement.id)
    }

    // Today - Special Events
    for (let achievement of todayDailies.special) {
      todayBuffer.push(achievement.id)
      todayCategories.special.push(achievement.id)
    }

    // Tomorrow - PvE
    for (let achievement of tomorrowDailies.pve) {
      const id = filterAchievements(achievement)
      if (id) {
        tomorrowBuffer.push(id)
        tomorrowCategories.pve.push(id)
      }
    }

    // Today - PvP
    for (let achievement of tomorrowDailies.pvp) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCategories.pvp.push(achievement.id)
    }

    // Today - WvW
    for (let achievement of tomorrowDailies.wvw) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCategories.wvw.push(achievement.id)
    }

    // Today - Fractals
    for (let achievement of tomorrowDailies.fractals) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCategories.fractals.push(achievement.id)
    }

    // Today - Special Events
    for (let achievement of tomorrowDailies.special) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCategories.special.push(achievement.id)
    }

    // Lookup Achievement IDs
    const todayDetails = await axios.get(
      dailyLookupUrl + todayBuffer.join());
    const tomorrowDetails = await axios.get(
      dailyLookupUrl + tomorrowBuffer.join());

    todayAchievements = todayDetails.data;
    tomorrowAchievements = tomorrowDetails.data;

    todayAchievementsDict = {};
    for (let achievement of todayAchievements) {
      const achievementID = achievement.id;
      todayAchievementsDict[achievementID] = achievement;
    }

    tomorrowAchievementsDict = {};
    for (let achievement of tomorrowAchievements) {
      const achievementID = achievement.id;
      tomorrowAchievementsDict[achievementID] = achievement;
    }

  } catch (err) {
    console.log(err);
  }
  res.render('daily', {
    todayAchievementsDict,
    tomorrowAchievementsDict,
    todayCategories,
    tomorrowCategories
  });
}