module.exports = async function compute_profit_loss(quantity, latestPrice, purchasedPrice){
    const purchasedValue = quantity * purchasedPrice
    const currentValue = quantity * latestPrice
    const gain_loss_amt = currentValue - purchasedValue
    const percent_gain_loss = (gain_loss_amt / purchasedValue) * 100
    return {
        gainLoss: gain_loss_amt,
        percentGainLoss : percent_gain_loss,
        currentValue: currentValue
    }
}