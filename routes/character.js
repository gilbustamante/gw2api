const express = require('express');
const character = require('../controllers/character');
const catchAsync = require('../utils/catchAsync');
const { hasCookie } = require('../middleware');
const router = express.Router();

// Bank Info
router.route('/bank')
  .get(hasCookie, catchAsync(character.renderBankInfo))

// Currency Info
router.route('/wallet')
  .get(hasCookie, catchAsync(character.renderWalletInfo))

module.exports = router;