const { body } = require('express-validator');

module.exports.validateApi = body('apiKey')
		.matches(/\w{8}-\w{4}-\w{4}-\w{4}-\w{20}-\w{4}-\w{4}-\w{4}-\w{12}/);

