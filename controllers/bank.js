const axios = require('axios').default;
const NodeCache = require('node-cache');
const gw2Cache = new NodeCache();

// Globals
let bankItems = [];
let itemDetails = [];

// Render Bank filter page
module.exports.renderBankInfo = async (req, res) => {
  try {
    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }

    var bank = [];
    var bankObj = {};
    // Empty slot counter
    bankObj.empty = 0;

    const url = 'https://api.guildwars2.com/v2/account/bank';
    bankItems = gw2Cache.get('bankItems');
    if (bankItems == undefined) {
      // Request bank items
      const res = await axios.get(url, config);
      bankItems = res.data;
      gw2Cache.set('bankItems', res.data, 300) // Five minute TTL
    }

    // Make an array of item IDs for next request
    for (let item of bankItems) {
      // Empty bank slots return 'null'
      if (item === null) {
        bankObj.empty++;
      } else {
        // Item ID, item quantity
        bank.push([item.id, item.count])
      }
    }

    // Request item info based on IDs
    const itemUrl = 'https://api.guildwars2.com/v2/items?ids='
    itemDetails = gw2Cache.get('itemDetails');
    if (itemDetails == undefined) {
      // Request item details
      const res = await axios.get(itemUrl + bank.join())
      itemDetails = res.data;
      gw2Cache.set('itemDetails', res.data, 300) // Five minute TTL
    }

    // Object with item ID keys and item object values
    for (let item of itemDetails) {
      const { id } = item;
      bankObj[id] = item;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('bank', { bank, bankObj });
}