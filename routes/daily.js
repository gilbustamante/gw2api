const express = require('express');
const daily = require('../controllers/daily');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

// Display Dailies
router.route('/')
  .get(catchAsync(daily.renderDailies));

module.exports = router;