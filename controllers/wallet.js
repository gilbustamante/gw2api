const axios = require('axios').default;
const NodeCache = require('node-cache');
const gw2Cache = new NodeCache();

module.exports = renderWallet = async (req, res) => {
  let wallet;
  try {
    // Request header config
    const config = {
      headers: {
        Authorization: 'Bearer ' + req.signedCookies.apiKey
      }
    }

    const url = 'https://api.guildwars2.com/v2/account/wallet';
    wallet = gw2Cache.get('currencies');
    if (wallet == undefined) {
      // Request wallet info
      const res = await axios.get(url, config);
      wallet = res.data;
      gw2Cache.set('wallet', wallet, 300) // Five minute TTL
    }

    console.log(wallet)

  } catch (err) {
    console.log(err)
  }
}