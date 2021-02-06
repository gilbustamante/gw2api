const express = require('express');
const account = require('../controllers/account');
const catchAsync = require('../utils/catchAsync');
const { hasCookie } = require('../middleware');
const router = express.Router();

// Bank
router.route('/bank')
  .get(hasCookie, catchAsync(account.renderBankInfo))

// Currency
router.route('/wallet')
  .get(hasCookie, catchAsync(account.renderWalletInfo))

// Crafting
router.route('/crafting')
  .get(hasCookie, catchAsync(account.renderCraftingInfo))

// Dyes
router.route('/dyes')
  .get(hasCookie, catchAsync(account.renderDyeInfo))

module.exports = router;