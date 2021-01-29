const express = require('express');
const achievements = require('../controllers/achievements');
const catchAsync = require('../utils/catchAsync');
const { hasCookie } = require('../middleware');
const router = express.Router();

// Display Dailies
router.route('/daily')
  .get(catchAsync(achievements.renderDailies));

router.route('/griffon')
  .get(hasCookie, catchAsync(achievements.renderGriffon));

module.exports = router;