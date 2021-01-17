const express = require('express');
const router = express.Router();

// Display Market Info
router.route('/')
  .get(async (req, res) => {
    res.send('hello');
  })

module.exports = router;