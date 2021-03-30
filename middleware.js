// Check if API key cookie exists, if not redirect to API page
module.exports.hasCookie = (req, res, next) => {
  if (!req.signedCookies.apiKey) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You need to input your API key before you can do that.')
    return res.redirect('/api')
  }
  next()
}
