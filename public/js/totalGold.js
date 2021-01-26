module.exports.totalGold = arr => {
  let allPrices = [];
  for (let item of arr) {
    allPrices.push(item.price * item.quantity);
  }
  const reducer = (acc, current) => acc + current;
  const profit = allPrices.reduce(reducer) * 0.85;
  return Math.floor(profit)
}