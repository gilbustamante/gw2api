const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const RecipeSchema = new Schema({
  id: Number,
  name: String,
  icon: String,
  type: String,
  output_id: Number,
  output_num: Number,
  disciplines: [String],
  min_rating: Number,
  flags: [String],
  ingredients: [
    {
      item_id: Number,
      count: Number,
      name: String,
      icon: String
    }
  ],
  chat_link: String
})

module.exports = mongoose.model('Recipe', RecipeSchema)
