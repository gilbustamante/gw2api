const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const ItemSchema = new Schema({
  id: Number,
  name: String,
  icon: String,
  level: Number,
  rarity: String
})

module.exports = mongoose.model('Item', ItemSchema)
