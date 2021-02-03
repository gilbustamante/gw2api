const axios = require('axios').default;
const Achievement = require('../models/achievement');
const NodeCache = require('node-cache');
const gw2Cache = new NodeCache();

module.exports.renderDailies = async (req, res) => {
  // Today's Quests Endpoint
  const dailyUrl = 'https://api.guildwars2.com/v2/achievements/daily?v=2019-05-16T00:00:00.000Z';
  // Tomorrow's Quests Endpoint
  const dailyTomorrowUrl = 'https://api.guildwars2.com/v2/achievements/daily/tomorrow?v=2019-05-16T00:00:00.000Z'
  // Lookup Quest IDs Endpoint
  const dailyLookupUrl = 'https://api.guildwars2.com/v2/achievements?ids='

  // Today
  let todayAchievements = {};
  let todayCats = {};
  let todayDailies = {};
  let todayBuffer = [];

  // Tomorrow
  let tomorrowAchievements = {};
  let tomorrowCats = {};
  let tomorrowDailies = {};
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
  res.render('achievements/daily', {
    todayDict,
    tomorrowDict,
    todayCats,
    tomorrowCats
  });
}

module.exports.renderGriffon = async (req, res) => {
  try {
    var achievements = {};
    var griffonAchievements = [];
    var achievementBuffer = [];

    // Griffon-related achievement IDs
    var griffonIds = [
      3736, // Sunspear Sanctuary
      3634, // Crystal Oasis
      3686, // Desert Highlands
      3834, // Elon Riverlands
      3856, // The Desolation
      3758, // Domain of Vabbi
      3662, // Sunspear Wisdom
      3867  // On Wings and a Prayer
    ];

    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }

    // Request or retrieve from cache
    achievementBuffer = gw2Cache.get('griffon');
    if (achievementBuffer == undefined) {
      const achievementsUrl = 'https://api.guildwars2.com/v2/account/achievements'
      const res = await axios.get(achievementsUrl, config);
      achievementBuffer = res.data;
      gw2Cache.set('griffon', res.data, 300) // Five minute TTL
    }

    // Create an object with 'achievement ID' keys and 'progress' values
    for (let a of achievementBuffer) {
      if (griffonIds.includes(a.id)) {
        // Calculate completion percentage for rendering progress bar
        const per = Math.round((a.current / a.max) * 100)
        a.per = per
        achievements[a.id] = a
      }
    }

    // Create array of griffon-related achievements
    for (let id of griffonIds) {
      const achievement = await Achievement.findOne({ id: id })
      griffonAchievements.push(achievement)
    }
  } catch (err) {
    console.log(err)
  }
  res.render('achievements/griffon', {
    achievements,
    griffonAchievements
  });
}

module.exports.renderSkyscale = async (req, res) => {
  try {
    var achievements = {};
    var skyscaleAchievements = [];
    var achievementBuffer = [];

    // Skyscale-related achievement IDs
    var skyscaleIds = [
      4714, // Newborn Skyscales
      4712, // Saving Skyscales
      4693, // Raising Skyscales
      4675, // Troublesome Skyscales
      4745  // Riding Skyscales
    ];

    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }

    // Request or retrieve from cache
    achievementBuffer = gw2Cache.get('skyscale')
    if (achievementBuffer == undefined) {
      const achievementsUrl = 'https://api.guildwars2.com/v2/account/achievements';
      const res = await axios.get(achievementsUrl, config);
      achievementBuffer = res.data;
      gw2Cache.set('skyscale', res.data, 300) // Five minute TTL
    }

    // Create object containing achievement IDs and their progress
    for (let a of achievementBuffer) {
      if (skyscaleIds.includes(a.id)) {
        // Calculate completion percentage
        const per = Math.round((a.current / a.max) * 100)
        a.per = per
        achievements[a.id] = a
      }
    }

    // Create array of skyscale achievements
    for (let id of skyscaleIds) {
      const achievement = await Achievement.findOne({ id: id })
      skyscaleAchievements.push(achievement)
    }
  } catch (err) {
    console.log(err)
  }
  res.render('achievements/skyscale', {
    achievements,
    skyscaleAchievements
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