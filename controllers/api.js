
// Render API Form
module.exports.renderAPIForm = (req, res) => {
  res.render('api');
}

// Handle API Key
module.exports.handleAPI = async (req, res) => {
  // Clear current (if any) apiKey cookie
  res.clearCookie('apiKey');

  // Cookie config
  const config = {
    signed: true,
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

  // Set new cookie
  res.cookie('apiKey', req.body.apiKey, config)

  // If user was redirected here from hasCookie middleware, redirect back
  // otherwise redirect to index
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo; // Clear returnTo from session
  req.flash('success', 'API key added (expires in one week).')
  res.redirect(redirectUrl);
}