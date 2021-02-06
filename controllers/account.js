const axios     = require('axios').default;
const Currency  = require('../models/currency');
const Dye       = require('../models/dye');
const Recipe    = require('../models/recipe');
const NodeCache = require('node-cache');
const gw2Cache  = new NodeCache();


// Render Bank filter page
module.exports.renderBankInfo = async (req, res) => {
  // Request header
  var config = {
    headers: {
      Authorization: 'Bearer ' + req.signedCookies.apiKey
    }
  }

  try {
    let bankItems = [];
    let itemDetails = [];
    var bank = [];
    var bankObj = {};
    bankObj.empty = 0; // Empty bank slot count

    const url = 'https://api.guildwars2.com/v2/account/bank';
    bankItems = gw2Cache.get('bankItems');
    if (bankItems === undefined) {
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
  res.render('account/bank', { bank, bankObj });
}

module.exports.renderWalletInfo = async (req, res) => {
  // Request header
  var config = {
    headers: {
      Authorization: 'Bearer ' + req.signedCookies.apiKey
    }
  }

  let wallet;
  try {
    const url = 'https://api.guildwars2.com/v2/account/wallet';
    wallet = gw2Cache.get('wallet');
    if (wallet === undefined) {
      // Request wallet info
      const res = await axios.get(url, config);
      wallet = res.data;
      gw2Cache.set('wallet', wallet, 300) // Five minute TTL
    }

    // Add name, description, and icon info to currency object
    for (let item of wallet) {
      const filter = { id: item.id };
      // Pull details from database
      const currency = await Currency.findOne(filter);
      item.name = currency.name;
      item.description = currency.description;
      item.icon = currency.icon;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('account/wallet', { wallet });
}

module.exports.renderCraftingInfo = async (req, res) => {
  // Request header
  var config = {
    headers: {
      Authorization: 'Bearer ' + req.signedCookies.apiKey
    }
  }

  let recipes = {};
  let recipeIds = [];
  try {
    // Retrieve or request given account's unlocked recipe IDs
    const url = 'https://api.guildwars2.com/v2/account/recipes/';
    recipeIds = gw2Cache.get('recipes');
    if (recipeIds === undefined) {
      const res = await axios.get(url, config);
      recipeIds = res.data;
      gw2Cache.set('recipes', res.data, 600) // Ten minute TTL
    }

    // Match recipe IDs with details in database
    for (let item of recipeIds) {
      const foundRecipe = await Recipe.findOne({ id: item })
      recipes[item] = foundRecipe;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('account/crafting', { recipes, recipeIds });
}

module.exports.renderDyeInfo = async (req, res) => {
  // Request header
  var config = {
    headers: {
      Authorization: 'Bearer ' + req.signedCookies.apiKey
    }
  }

  let dyes = {};
  let dyeIds = [];
  try {
    const url = 'https://api.guildwars2.com/v2/account/dyes';
    dyeIds = gw2Cache.get('dyes');
    if (dyeIds === undefined) {
      const res = await axios.get(url, config);
      dyeIds = res.data;
      gw2Cache.set('dyes', res.data, 600) // Ten minute TTL
    }

    // Match dye IDs with details in database
    for (let item of dyeIds) {
      const foundDye = await Dye.findOne({ id: item })
      dyes[item] = foundDye;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('account/dyes', { dyes, dyeIds });
}