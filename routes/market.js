const express = require('express');
const market = require('../controllers/market');
const { hasCookie } = require('../middleware');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Display Market Info
router.route('/history')
  .get(hasCookie, catchAsync(market.renderMarketHistory))

router.route('/current')
  .get(hasCookie, catchAsync(market.renderMarketCurrent))
module.exports = router;
