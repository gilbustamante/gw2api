module.exports.convertGold = (amount) => {
  let price = amount.toString();
  if (price.length > 4) {
    const copper = price.slice(-2); // last 2 digits
    const silver = price.slice(-4, -2); // next 2
    const gold   = price.slice(0, -4); // everything else
    return `${gold} <img src="/img/gold.png"> 
            ${silver} <img src="/img/silver.png"> 
            ${copper} <img src="/img/copper.png">`;
  } else if (price.length <= 4 && price.length > 2) {
    const copper = price.slice(-2);
    const silver = price.slice(0, -2);
    return `${silver} <img src="/img/silver.png"> 
            ${copper} <img src="/img/copper.png">`;
  }
  return `${price} copper`;
}