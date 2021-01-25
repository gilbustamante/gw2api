const express = require('express');
const bank = require('../controllers/bank');
const catchAsync = require('../utils/catchAsync');
const { hasCookie } = require('../middleware');
const router = express.Router();

router.route('/')
  .get(hasCookie, catchAsync(bank.renderBankInfo))

module.exports = router;