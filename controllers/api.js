const ExpressError         = require('../utils/ExpressError');
const { validationResult } = require('express-validator');

// Render API Form
module.exports.renderAPIForm = (req, res) => {
  res.render('api');
}

// Handle API Key
module.exports.handleAPI = async (req, res) => {
  // Validate API key
  const errors = validationResult(req);
  if (errors.errors.length > 0) {
    req.flash('error', 'Please enter a valid API key.')
    return res.redirect('api');
  }

  // Clear current (if any) apiKey cookie
  res.clearCookie('apiKey');

  // Cookie config
  const config = {
    signed: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 30, // One month
    maxAge: 1000 * 60 * 60 * 24 * 30
  }

  // Set new cookie
  res.cookie('apiKey', req.body.apiKey, config)

  // If user was redirected here from hasCookie middleware, redirect back
  // otherwise redirect to index
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo; // Clear returnTo from session
  req.flash('success', 'API key added (expires in 30 days).')
  res.redirect(redirectUrl);
}
