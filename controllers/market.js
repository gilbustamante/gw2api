const axios = require('axios').default;

module.exports.renderMarket = async (req, res) => {
  try {
    var itemBuffer = [];
    var itemsDict = {};
    var items = [];

    const config = {
      headers: {
        Authorization: 'Bearer ' + process.env.API_KEY
      }
    }
    const marketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/history/sells';
    const marketRes = await axios.get(marketUrl, config)

    items = marketRes.data;

    for (let i of marketRes.data) {
      itemBuffer.push(i.item_id)
    }

    const itemUrl = 'https://api.guildwars2.com/v2/items?ids='
    const itemRes = await axios.get(itemUrl + itemBuffer.join())

    for (let i of itemRes.data) {
      const id = i.id;
      itemsDict[id] = i;
    }

  } catch (err) {
    console.log(err)
  }

  res.render('market', { items, itemsDict });
}