const axios = require('axios').default;
const Item = require('../models/item');
const NodeCache = require('node-cache');
const gw2cache = new NodeCache();

// TODO: add validation for apiKey

module.exports.renderMarketHistory = async (req, res) => {
  try {
    // Sold items
    var sellBuffer = [];
    var sellDict = {};
    var sell = [];
    var sellDetails = [];

    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }
    // Request sell history data
    const sellMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/history/sells';
    sell = gw2cache.get('sellHistory');
    if (sell === undefined) {
      // Request sell history
      const res = await axios.get(sellMarketUrl, config)
      sell = res.data;
      gw2cache.set('sellHistory', res.data, 300) // Five minute TTL
    }

    // Make a list of item IDs for next request
    for (let i of sell) {
      sellBuffer.push(i.item_id)
    }

    // Retrieve item info from database
    for (let i of sellBuffer) {
      const filter = { id: i };
      const item = await Item.findOne(filter);
      sellDetails.push(item);
    }

    // Populate dictionary with item ID keys and item object values
    for (let i of sellDetails) {
      const id = i.id;
      sellDict[ id ] = i;
    }

    ///////////////////////////////////////////////////////////

    // Bought Items
    var buyBuffer = [];
    var buyDict = {};
    var buy = [];
    var buyDetails = [];

    // Request buy history data
    const buyMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/history/buys';
    buy = gw2cache.get('buyHistory');
    if (buy === undefined) {
      const res = await axios.get(buyMarketUrl, config)
      buy = res.data;
      gw2cache.set('buyHistory', res.data, 300)
    }

    // Make a list of item IDs for next request
    for (let i of buy) {
      buyBuffer.push(i.item_id)
    }

    // Retrieve item info from database
    for (let i of buyBuffer) {
      const filter = { id: i };
      const item = await Item.findOne(filter);
      buyDetails.push(item)
    }

    // Create dictionary with item ID keys and item object values
    for (let i of buyDetails) {
      const id = i.id;
      buyDict[ id ] = i;
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
    var sellDetails = [];

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
    // Retrieve item details from database
    for (let i of sellBuffer) {
      const filter = { id: i };
      const item = await Item.findOne(filter);
      sellDetails.push(item);
    }

    // Create dictionary with item ID keys and item object values
    for (let i of sellDetails) {
      const id = i.id;
      sellDict[ id ] = i;
    }

    ///////////////////////////////////////////////////////////

    // Buy Orders
    var buyBuffer = [];
    var buyDict = {};
    var buy = [];
    var buyDetails = [];

    // Request current buy orders
    const buyMarketUrl = 'https://api.guildwars2.com/v2/commerce/transactions/current/buys'
    const buyMarketRes = await axios.get(buyMarketUrl, config)

    // List to iterate over
    buy = buyMarketRes.data;

    // Make list of item IDs for next request
    for (let i of buy) {
      buyBuffer.push(i.item_id)
    }

    // Retrieve item info from database
    for (let i of buyBuffer) {
      const filter = { id: i };
      const item = await Item.findOne(filter);
      buyDetails.push(item);
    }

    // Create dictionary with item ID keys and item object values
    for (let i of buyDetails) {
      const id = i.id;
      buyDict[ id ] = i;
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

    // GW2 API has a 'max items per request' limit of 200
    // TODO: handle this error if encountered
    if (allOrders.length > 200) {
      console.log('Total items is greater than 200, some results will not be found...')
    }

    // Request listing info
    const listingUrl = 'https://api.guildwars2.com/v2/commerce/prices?ids='
    const listingRes = await axios.get(listingUrl + allOrders.join())

    // Give sell objects the current market's sell price
    for (let order of sell) {
      for (let item of listingRes.data) {
        if (item.id === order.item_id) {
          order.currentSell = item.sells.unit_price;
        }
      }
    }

    // Give buy objects the current market's buy price
    for (let order of buy) {
      for (let item of listingRes.data) {
        if (item.id === order.item_id) {
          order.currentBuy = item.buys.unit_price;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.render('market/current', { sell, sellDict, buy, buyDict, delivery })
}

module.exports.renderMarketWatchlist = async (req, res) => {
  res.render('market/watchlist')
}

module.exports.MarketSearch = async (req, res) => {
  const searchQuery = req.body.marketSearch;
  console.log(searchQuery);
  const foundItems = await Item.find({ 'name': searchQuery });
  console.log(foundItems)
  res.render('market/watchlist', { items: foundItems })
}