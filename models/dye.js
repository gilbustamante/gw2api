const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const DyeSchema = new Schema({
  id: Number,
  name: String,
  rgb: [Number],
  categories: [String]
})

module.exports = mongoose.model('Dye', DyeSchema)
