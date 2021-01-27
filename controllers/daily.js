const axios = require('axios').default;
const NodeCache = require('node-cache');
const gw2Cache = new NodeCache();

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
    // Retrieve today/tomorrow dailies from cache, otherwise request data
    todayDailies = gw2Cache.get('today');
    if (todayDailies == undefined) {
      // Request Today's Dailies
      const today = await axios.get(dailyUrl);
      todayDailies = today.data;
      gw2Cache.set('today', today.data, 3600) // One hour TTL
    }
    tomorrowDailies = gw2Cache.get('tomorrow');
    if (tomorrowDailies == undefined) {
      // Request Tomorrow's Dailies
      const tomorrow = await axios.get(dailyTomorrowUrl);
      tomorrowDailies = tomorrow.data;
      gw2Cache.set('tomorrow', tomorrow.data, 3600) // One hour TTL
    }

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

    //////////////////////////////////////////////

    // Tomorrow - PvE
    for (let achievement of tomorrowDailies.pve) {
      const id = filterAchievements(achievement)
      if (id) {
        tomorrowBuffer.push(id)
        tomorrowCats.pve.push(id)
      }
    }

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

    //////////////////////////////////////////////

    // Retrieve today/tomorrow achievements from cache, otherwise request data
    todayAchievements = gw2Cache.get('todayAchievements');
    if (todayAchievements == undefined) {
      const details = await axios.get(dailyLookupUrl + todayBuffer.join());
      todayAchievements = details.data;
      gw2Cache.set('todayAchievements', details.data, 3600) // One hour TTL
    }
    tomorrowAchievements = gw2Cache.get('tomorrowAchievements');
    if (tomorrowAchievements == undefined) {
      const details = await axios.get(dailyLookupUrl + tomorrowBuffer.join());
      tomorrowAchievements = details.data;
      gw2Cache.set('tomorrowAchievements', details.data, 3600) // One hour TTL
    }

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