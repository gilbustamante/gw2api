const axios = require('axios').default;

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
    const response = await axios.get(url, config);

    // Make an array of item IDs for next request
    for (let item of response.data) {
      if (item === null) {
        bankObj.empty++;
      } else {
        bank.push((item.id).toString())
      }
    }

    // Request item info based on IDs
    const itemUrl = 'https://api.guildwars2.com/v2/items?ids='
    const itemRes = await axios.get(itemUrl + bank.join())

    // Object with item ID keys and item object values
    for (let item of itemRes.data) {
      const { id } = item;
      bankObj[id] = item;
    }
  } catch (err) {
    console.log(err)
  }
  res.render('bank', { bank, bankObj });
}