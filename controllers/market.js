const axios = require('axios').default;

// TODO: add validation for apiKey

module.exports.renderMarketHistory = async (req, res) => {
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

    // Request buy history data
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
  res.render('market/history', { sell, sellDict, buy, buyDict });
}

module.exports.renderMarketCurrent = async (req, res) => {
  try {
    // Sell Orders
    var sellBuffer = [];
    var sellDict = {};
    var sell = [];

    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }

    // Request current sell orders
    const sellMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/current/sells';
    const sellMarketRes = await axios.get(sellMarketUrl, config)

    // List to iterate over
    sell = sellMarketRes.data;

    // Make a list of item IDs for next request
    for (let i of sell) {
      sellBuffer.push(i.item_id)
    }

    // Request item info based on item IDs
    const sellItemUrl = 'https://api.guildwars2.com/v2/items?ids=';
    const sellItemRes = await axios.get(sellItemUrl + sellBuffer.join())

    // Create dictionary with item ID keys and item object values
    for (let i of sellItemRes.data) {
      const id = i.id;
      sellDict[id] = i;
    }
    
    ///////////////////////////////////////////////////////////

    // Buy Orders
    var buyBuffer = [];
    var buyDict = {};
    var buy = [];

    // Request current buy orders
    const buyMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/current/buys'
    const buyMarketRes = await axios.get(buyMarketUrl, config)

    // List to iterate over
    buy = buyMarketRes.data;

    // Make list of item IDs for next request
    for (let i of buy) {
      buyBuffer.push(i.item_id)
    }

    // Request item info based on item IDs (using sellItemUrl)
    const buyItemRes = await axios.get(sellItemUrl + buyBuffer.join())

    // Create dictionary with item ID keys and item object values
    for (let i of buyItemRes.data) {
      const id = i.id;
      buyDict[id] = i;
    }

    ///////////////////////////////////////////////////////////

    // Items waiting for pickup

    const deliveryUrl = 'https://api.guildwars2.com/v2/commerce/delivery'
    const deliveryRes = await axios.get(deliveryUrl, config)
    let items = 0
    for (let item of deliveryRes.data.items) {
      items = items + item.count;
    }

    // TODO: Show each individual item (with icon maybe?)
    var delivery = {
      'coins': deliveryRes.data.coins,
      'itemCount': items
    }

    ///////////////////////////////////////////////////////////

    // Pulling current listing prices
    
    // Make a new array of every unique order listed
    const tempSet = new Set(sellBuffer.concat(buyBuffer));
    const allOrders = Array.from(tempSet);
    
    // Request listing info
    const listingUrl = 'https://api.guildwars2.com/v2/commerce/listings?ids='
    const listingRes = await axios.get(listingUrl + allOrders.join())

    // Give sell objects the current market's sell price
    for (let order of sell) {
      for (let item of listingRes.data) {
        if (item.id === order.item_id) {
          order.currentSell = item.sells[0].unit_price;
        }
      }
    }

    // Give buy objects the current market's buy price
    for (let order of buy) {
      for (let item of listingRes.data) {
        if (item.id === order.item_id) {
          order.currentBuy = item.buys[0].unit_price;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.render('market/current', { sell, sellDict, buy, buyDict, delivery })
}