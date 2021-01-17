const axios = require('axios').default;

module.exports.renderMarket = async (req, res) => {
  try {
    const config = {
      headers: {
        Authorization: 'Bearer ' + process.env.API_KEY
      }
    }
    const url = 'https://api.guildwars2.com/v2/commerce/transactions/history/sells';
    const res = await axios.get(url, config)
    var items = res.data;
  } catch (err) {
    console.log(err)
  }

  res.render('market', { items });
}