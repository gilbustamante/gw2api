const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const CurrencySchema = new Schema({
  id: Number,
  name: String,
  description: String,
  icon: String
})

module.exports = mongoose.model('Currency', CurrencySchema)
