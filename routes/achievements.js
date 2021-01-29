const express = require('express');
const achievements = require('../controllers/achievements');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

// Display Dailies
router.route('/daily')
  .get(catchAsync(achievements.renderDailies));

module.exports = router;