
// Render API Form
module.exports.renderAPIForm = (req, res) => {
  res.render('api');
}

// Handle API Key
module.exports.handleAPI = async (req, res) => {
  // Set cookie
  res.cookie('apiKey', req.body.apiKey, { signed: true })
  // If user was redirected here from hasCookie middleware, redirect back
  // otherwise redirect to index
  const redirectUrl = req.session.returnTo || '/';
  req.flash('success', 'API key added.')
  res.redirect(redirectUrl);
}