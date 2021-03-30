const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AchievementSchema = new Schema({
  id: Number,
  name: String,
  description: String,
  requirement: String,
  type: String,
  flags: [String],
  tiers: [
    {
      count: Number,
      points: Number
    }
  ]
})

module.exports = mongoose.model('Achievement', AchievementSchema)
