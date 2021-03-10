// Populate database with item details

const mongoose = require('mongoose');
const axios    = require('axios').default;
const Item     = require('../models/item');

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
  await Item.deleteMany({});
  console.log('Cleared item collection')
  // Request item IDs
  const url = 'https://api.guildwars2.com/v2/items';
  const ids = await axios.get(url);
  // Make 'empty' items with just their IDs for now
  for (let id of ids.data) {
    const item = new Item({
      id: id
    });
    await item.save();
    console.log(`Created item: ${id}`)
  }
  console.log('Done')
}

// getIds().then(() => {
//   mongoose.connection.close();
//   console.log('Database disconnected')
// });

const getDetails = async () => {
  // 299 total pages according to Arenanet's x-page-total response header
  // 600 requests per minute is the limit!
  for (let i = 0; i < 299; i++) {
    // Request item details, max allowed is 200 per request
    const detailsUrl = `https://api.guildwars2.com/v2/items?page=${i}&page_size=200`
    const res = await axios.get(detailsUrl);
    const details = res.data;
    for (let i of details) {
      const filter = { id: i.id }
      const update = {
        name: i.name,
        icon: i.icon,
        level: i.level,
        rarity: i.rarity,
      }
      const item = await Item.findOneAndUpdate(filter, update)
      console.log(`Item updated: ${item.id} - ${item.name}`)
    }
  }
  console.log('Done')
}

getDetails().then(() => {
  mongoose.connection.close();
  console.log('Database disconnected');
});