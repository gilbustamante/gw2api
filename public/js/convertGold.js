module.exports.convertGold = (amount) => {
  let price = amount.toString();
  if (price.length > 4) {
    const copper = price.slice(-2); // last 2 digits
    const silver = price.slice(-4, -2); // next 2
    const gold   = price.slice(0, -4); // everything else
    return `${gold} gold, ${silver} silver, ${copper} copper`;
  } else if (price.length <= 4 && price.length > 2) {
    const copper = price.slice(-2);
    const silver = price.slice(0, -2);
    return `${silver} silver, ${copper} copper`;
  }
  return `${price} copper`;
}