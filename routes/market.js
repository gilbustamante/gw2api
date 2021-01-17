const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Display Market Info
router.route('/')
  .get(catchAsync(async (req, res) => {
    res.render('market');
  }))

module.exports = router;