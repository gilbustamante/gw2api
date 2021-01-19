const express = require('express');
const market = require('../controllers/market');
const { hasCookie } = require('../middleware');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Display Market Info
router.route('/')
  .get(hasCookie, catchAsync(market.renderMarket))

module.exports = router;
