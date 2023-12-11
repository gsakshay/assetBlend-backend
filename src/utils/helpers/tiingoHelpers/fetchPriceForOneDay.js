const StockController = require('../../../tingoServices/controllers/queryStockDataController')
const CryptoController = require('../../../tingoServices/controllers/queryCryptoDataController')
const customError = require('../../errors/customError')

module.exports = async function fetchPriceForOneDay(ticker, type, requestParams) {
    try{
        let price = null
        if(type==="stock"){
            const latestStockData = await StockController.getPriceOnDate(requestParams, ticker)
            if(latestStockData && latestStockData.length>0){
                price = latestStockData[0]
            }
        }else if(type === "crypto"){
            const cryptoLatestPrices = await CryptoController.getPriceOnDate(requestParams)
            if(cryptoLatestPrices && cryptoLatestPrices.length > 0 && cryptoLatestPrices[0].priceData){
                price = cryptoLatestPrices[0].priceData
            }
        }else{
            throw new customError("Invalid type of asset. Accepted type are stock crypto")
        }
        return price
    }catch(error){
        throw new customError("Failed to fetch price", 500, 'error')
    }
    
}