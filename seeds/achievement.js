// Populate database with achievement details

const mongoose    = require('mongoose');
const axios = require('axios').default;
const Achievement = require('../models/achievement');

const database = process.env.DATABASE_URL || 'mongodb://localhost:27017/gw2';
mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const getIds = async () => {
  await Achievement.deleteMany({});
  console.log('Cleared achievement collection')
  // First we pull all achievement IDs
  const url = 'https://api.guildwars2.com/v2/achievements';
  const ids = await axios.get(url);
  for (let id of ids.data) {
    const achievement = new Achievement({
      id: id,
    })
    await achievement.save();
    console.log(`Created achievement: ${id}`)
  }
  console.log('Done')
}

// getIds().then(() => {
//   db.close();
//   console.log('Database disconnected')
// });

const getDetails = async () => {
  for (let i = 0; i < 20; i++) {
    const detailsUrl = `https://api.guildwars2.com/v2/achievements?page=${i}&page_size=200`
    const res = await axios.get(detailsUrl);
    const details = res.data;
    for (let a of details) {
      // Make sure we're not pulling empty achievements
      if (a.flags !== [] && a.tiers !== []) {
        const filter = { id: a.id }
        const update = {
          name: a.name,
          description: a.description,
          requirement: a.requirement,
          type: a.type,
          flags: a.flags,
          tiers: a.tiers
        }
        const achievement = await Achievement.findOneAndUpdate(filter, update)
        console.log(achievement)
      }
    }
  }
}

getDetails().then(() => {
  mongoose.connection.close();
  console.log('Database disconnected');
});

const test = async () => {
  const achievements = await Achievement.find({});
  for (let i of achievements) {
    console.log(i)
  }
}

// test().then(() => {
//   db.close();
//   console.log('Database disconnected');
// });