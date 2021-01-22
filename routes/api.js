const express = require('express');
const api = require('../controllers/api');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.route('/')
  .get(api.renderAPIForm)
  .post(catchAsync(api.handleAPI));

module.exports = router;