// Populate database with dyes

const mongoose = require('mongoose');
const axios    = require('axios').default;
const Dye      = require('../models/dye');

const dbUrl = process.DATABASE_URL || 'mongodb://localhost:27017/gw2';
mongoose.connect(dbUrl, {
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
  await Dye.deleteMany({});
  console.log('Cleared dye collection');

  // 4 pages as per arenanet's response header
  for (let i = 0; i < 4; i++) {
    const url = `https://api.guildwars2.com/v2/colors?page=${i}&page_size=200`;
    const res = await axios.get(url);

    for (let d of res.data) {
      if (d.id === 1) continue;
      const dye = new Dye({
        id: d.id,
        name: d.name,
        rgb: d.cloth.rgb,
        categories: d.categories
      });
      await dye.save();
      console.log(`Created dye: ${dye.name}`);
    }
  }
  console.log('Done')
}

getIds().then(() => {
  db.close();
  console.log('Database disconnected')
});