// Returns the expected net profit from all sell orders
module.exports.totalGold = arr => {
  const allPrices = []
  for (const item of arr) {
    allPrices.push(item.price * item.quantity)
  }
  const reducer = (acc, current) => acc + current
  const profit = allPrices.reduce(reducer) * 0.85
  return Math.floor(profit)
}
