const express = require('express');
const market = require('../controllers/market');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Display Market Info
router.route('/')
  .get(catchAsync(market.renderMarket))

module.exports = router;