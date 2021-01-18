const axios = require('axios').default;

//// Globals
// Today
let todayAchievements = {};
let todayCats = {};
let todayDailies = {};
// Tomorrow
let tomorrowAchievements = {};
let tomorrowCats = {};
let tomorrowDailies = {};

// Today's Quests Endpoint
const dailyUrl = 'https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z';
// Tomorrow's Quests Endpoint
const dailyTomorrowUrl = 'https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z'
// Lookup Quest IDs Endpoint
const dailyLookupUrl = 'https://api.guildwars2.com/v2/achievements?ids='

module.exports.renderDailies = async (req, res) => {
  let todayBuffer = [];
  let tomorrowBuffer = [];
  todayCats = {
    'pve': [],
    'pvp': [],
    'wvw': [],
    'fractals': [],
    'special': []
  }

  tomorrowCats = {
    'pve': [],
    'pvp': [],
    'wvw': [],
    'fractals': [],
    'special': []
  }

  //// TODO: Refactor this stuff ////
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
        todayCats.pve.push(id)
      }
    }

    // Today - PvP
    for (let achievement of todayDailies.pvp) {
      todayBuffer.push(achievement.id)
      todayCats.pvp.push(achievement.id)
    }

    // Today - WvW
    for (let achievement of todayDailies.wvw) {
      todayBuffer.push(achievement.id)
      todayCats.wvw.push(achievement.id)
    }

    // Today - Fractals
    for (let achievement of todayDailies.fractals) {
      todayBuffer.push(achievement.id)
      todayCats.fractals.push(achievement.id)
    }

    // Today - Special Events
    for (let achievement of todayDailies.special) {
      todayBuffer.push(achievement.id)
      todayCats.special.push(achievement.id)
    }

    // Tomorrow - PvE
    for (let achievement of tomorrowDailies.pve) {
      const id = filterAchievements(achievement)
      if (id) {
        tomorrowBuffer.push(id)
        tomorrowCats.pve.push(id)
      }
    }

    //////////////////////////////////////////////

    // Tomorrow - PvP
    for (let achievement of tomorrowDailies.pvp) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCats.pvp.push(achievement.id)
    }

    // Tomorrow - WvW
    for (let achievement of tomorrowDailies.wvw) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCats.wvw.push(achievement.id)
    }

    // Tomorrow - Fractals
    for (let achievement of tomorrowDailies.fractals) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCats.fractals.push(achievement.id)
    }

    // Tomorrow - Special Events
    for (let achievement of tomorrowDailies.special) {
      tomorrowBuffer.push(achievement.id)
      tomorrowCats.special.push(achievement.id)
    }

    // Lookup Achievement IDs
    const todayDetails = await axios.get(
      dailyLookupUrl + todayBuffer.join());
    const tomorrowDetails = await axios.get(
      dailyLookupUrl + tomorrowBuffer.join());

    todayAchievements = todayDetails.data;
    tomorrowAchievements = tomorrowDetails.data;

    todayDict = {};
    for (let achievement of todayAchievements) {
      const achievementID = achievement.id;
      todayDict[achievementID] = achievement;
    }

    tomorrowDict = {};
    for (let achievement of tomorrowAchievements) {
      const achievementID = achievement.id;
      tomorrowDict[achievementID] = achievement;
    }

  } catch (err) {
    console.log(err);
  }
  res.render('daily', {
    todayDict,
    tomorrowDict,
    todayCats,
    tomorrowCats
  });
}

const filterAchievements = item => {
  // If it's a low-level quest, ignore
  if (item.level.max < 80) { return null }
  // If it's for non-expansion players, ignore
  if (item.required_access) {
    if (item.required_access.condition === 'NoAccess') {
      return null;
    }
  }
  return item.id;
}