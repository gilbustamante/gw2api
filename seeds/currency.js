// Populate database with currency details

const mongoose = require('mongoose');
const axios    = require('axios').default;
const Currency = require('../models/currency');

const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/gw2';
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const getDetails = async () => {
  await Currency.deleteMany({});
  console.log('Cleared currency collection')
  // Request currency details
  const url = 'https://api.guildwars2.com/v2/currencies?ids=all';
  const response = await axios.get(url);
  // Create document for each currency
  for (let c of response.data) {
    const currency = new Currency({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon
    });
    await currency.save();
    console.log(`Created currency: ${currency.name}`);
  }
  console.log('Done')
}

getDetails().then(() => {
  db.close();
  console.log('Database disconnected')
});