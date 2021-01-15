const express = require('express');
const daily = require('../controllers/daily');
const router = express.Router();

// Display Dailies
router.route('/')
  // .get(daily.displayDailies);
  .get(daily.dailyBeta);

module.exports = router;