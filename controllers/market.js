const axios = require('axios').default;

// TODO: add validation for apiKey

module.exports.renderMarket = async (req, res) => {
  try {
    // Sold items
    var sellBuffer = [];
    var sellDict = {};
    var sell = [];

    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }
    // Request sell history data
    const sellMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/history/sells';
    const sellMarketRes = await axios.get(sellMarketUrl, config)

    // List to iterate over
    sell = sellMarketRes.data;

    // Make a list of item IDs for next request
    for (let i of sell) {
      sellBuffer.push(i.item_id)
    }

    // Request item info based on item IDs
    const sellItemUrl = 'https://api.guildwars2.com/v2/items?ids='
    const sellItemRes = await axios.get(sellItemUrl + sellBuffer.join())

    // Create dictionary with item ID keys and item object values
    for (let i of sellItemRes.data) {
      const id = i.id;
      sellDict[id] = i;
    }

    ///////////////////////////////////////////////////////////

    // Bought Items
    var buyBuffer = [];
    var buyDict = {};
    var buy = [];

    const buyMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/history/buys';
    const buyMarketRes = await axios.get(buyMarketUrl, config)

    // List to iterate over
    buy = buyMarketRes.data;

    // Make a list of item IDs for next request
    for (let i of buy) {
      buyBuffer.push(i.item_id)
    }

    // Request item info based on item IDs
    // Re-using sellItemUrl
    const buyItemRes = await axios.get(sellItemUrl + buyBuffer.join())

    // Create dictionary with item ID keys and item object values
    for (let i of buyItemRes.data) {
      const id = i.id;
      buyDict[id] = i;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('market', { sell, sellDict, buy, buyDict });
}