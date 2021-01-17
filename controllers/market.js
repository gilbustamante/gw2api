const axios = require('axios').default;

module.exports.renderMarket = async (req, res) => {
  try {
    var itemBuffer = [];
    var itemsDict = {};
    var items = [];

    // Axios Config
    const config = {
      headers: {
        Authorization: 'Bearer ' + process.env.API_KEY
      }
    }
    // Request sell history data
    const marketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/history/sells';
    const marketRes = await axios.get(marketUrl, config)

    // List to iterate over
    items = marketRes.data;

    // Make a list of item IDs for next request
    for (let i of marketRes.data) {
      itemBuffer.push(i.item_id)
    }

    // Request item info based on item IDs
    const itemUrl = 'https://api.guildwars2.com/v2/items?ids='
    const itemRes = await axios.get(itemUrl + itemBuffer.join())

    // Create dictionary with item ID keys and item object values
    for (let i of itemRes.data) {
      const id = i.id;
      itemsDict[id] = i;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('market', { items, itemsDict });
}