const express = require('express');
const bank = require('../controllers/bank');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.route('/')
  .get(catchAsync(bank.renderBankInfo))

module.exports = router;