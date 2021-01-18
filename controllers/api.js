
// Render API Form
module.exports.renderAPIForm = (req, res) => {
  res.render('api');
}

// Handle API Key
module.exports.handleAPI = async (req, res) => {
  console.log(req.body.apiKey)
  req.flash('success', 'API key received.')
  res.redirect('/')
}