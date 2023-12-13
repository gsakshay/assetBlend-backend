const customError = require("../../utils/errors/customError")
const FetchCrypto = require("../queries/crypto/fetchCrypto")
const FetchStock = require("../queries/stocks/fetchStock")
const FetchCryptoHandler = require("./crypto/fetchCryptoHandler")
const FetchStockHandler = require("./stocks/fetchStockHandler")
const StockController = require('../../tingoServices/controllers/queryStockDataController')
const CryptoController = require('../../tingoServices/controllers/queryCryptoDataController')
const fetchPriceForOneDay = require('../../utils/helpers/tiingoHelpers/fetchPriceForOneDay')
const computeProfitLoss = require("../../utils/helpers/tiingoHelpers/computeProfitLoss")

class GetAssetWorthHandler{
    async handle(query){
        try{
            const type = query.type
            const assetPayload = query.assetPayload

            if(!assetPayload.assetId || !assetPayload.ticker || !assetPayload.quantity || !assetPayload.datePurchased || !type){
                throw new customError("Missing parameter. Expected assetId, ticker, quantity, datePurchased and type.")
            }

            let latestPrice = null
            const ticker = assetPayload.ticker
            let request_params
            // fetch current price based on type
            if(type==="stock"){
                request_params = {}
            }else if(type === "crypto"){
                request_params = {
                    tickers:ticker,
                    resampleFreq:"1day"
                }
            }else{
                throw new customError("Invalid type of asset. Accepted type are stock crypto")
            }

            latestPrice = await fetchPriceForOneDay(assetPayload.ticker, type, request_params)
            if(latestPrice === null) {
                throw new customError("No data available for this asset", 400, 'error')
            }
            let purchasedPrice = null
            // get price on purchase
            if(type==="stock"){
                request_params = {
                    startDate: assetPayload.datePurchased,
                    endDate:assetPayload.datePurchased,
                    resampleFreq:"daily"
                }
            }else if(type === "crypto"){
                request_params = {
                    startDate: assetPayload.datePurchased,
                    endDate:assetPayload.datePurchased,
                    tickers:ticker,
                    resampleFreq:"1day"
                }
            }else{
                throw new customError("Invalid type of asset. Accepted type are stock crypto")
            }
            purchasedPrice = await fetchPriceForOneDay(ticker, type, request_params)
            
            if(purchasedPrice=== null) {
                throw new customError("No data available for this asset", 400, 'error')
            }
            let finalPurchasePrice
            let finalLatestPrice
            if(type==="stock"){
                finalPurchasePrice = purchasedPrice.close
                finalLatestPrice = latestPrice.close
            }else{
                finalPurchasePrice = purchasedPrice[0].close
                finalLatestPrice = latestPrice[0].close
            }
            const profit_loss = await computeProfitLoss(assetPayload.quantity, finalPurchasePrice, finalLatestPrice) 
            return profit_loss
        }catch(error){
            if(error.status === 400){
                throw error
            }else{
                throw new customError("Failed to evaluate asset price", 500, 'error')
            }
            
        }
        
    }
}

module.exports = GetAssetWorthHandler