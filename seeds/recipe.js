// Populate database with currency details

const mongoose = require('mongoose');
const axios    = require('axios').default;
const Recipe   = require('../models/recipe');
const Item     = require('../models/item');

const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/gw2';
mongoose.connect(databaseUrl, {
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

const getDetails = async () => {
  await Recipe.deleteMany({});
  console.log('Cleared recipe collection')
  // Request recipe details
  for (let i = 0; i < 63; i++) { // 63 pages as per arenanet's response header
    const url = `https://api.guildwars2.com/v2/recipes?page=${i}&page_size=200`
    const res = await axios.get(url);
    // Create document for each recipe
    for (let r of res.data) {
      // TODO:
      // For some reason, 'GuildDecoration' recipes cause the object
      // creation to break so I'll figure out a real fix later.
      if (r.type === 'GuildDecoration') {
        console.log(`Ignoring 'GuildDecoration' recipe: ${r.id}`)
        continue;
      }

      // Create recipe object and save to database
      try {
        const item = await Item.findOne({ id: r.output_item_id} );
        const recipe = new Recipe({
          id: r.id,
          name: item.name,
          icon: item.icon,
          type: r.type,
          output_id: r.output_item_id,
          output_num: r.output_item_count,
          disciplines: r.disciplines,
          min_rating: r.min_rating,
          flags: r.flags,
          ingredients: r.ingredients,
          chat_link: r.chat_link
        });

        // Add each ingredient name and icon
        for (let ingr of recipe.ingredients) {
          const ingredient = await Item.findOne({ id: ingr.item_id })
          ingr.name = ingredient.name;
          ingr.icon = ingredient.icon;
        }

        await recipe.save()
        console.log(`Created recipe: ${recipe.name} [${recipe.id}]`)
      } catch (err) {
        console.log(`Could not find/add: ${r.id}`)
      }
    }
    console.log(`FINISH PAGE: ${i}`)
  }
  console.log('Done')
}

getDetails().then(() => {
  db.close();
  console.log('Database disconnected')
});