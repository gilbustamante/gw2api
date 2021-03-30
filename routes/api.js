const express         = require('express')
const api             = require('../controllers/api')
const catchAsync      = require('../utils/catchAsync')
const { validateApi } = require('../utils/validateApi')
const router          = express.Router()

router.route('/')
  .get(api.renderAPIForm)
  .post(validateApi, catchAsync(api.handleAPI))

module.exports = router
