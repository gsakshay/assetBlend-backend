const FetchCrypto = require("../queries/crypto/fetchCrypto")
const FetchStock = require("../queries/stocks/fetchStock")
const FetchCryptoHandler = require("./crypto/fetchCryptoHandler")
const FetchStockHandler = require("./stocks/fetchStockHandler")
const StockController = require('../../tingoServices/controllers/queryStockDataController')
const CryptoController = require('../../tingoServices/controllers/queryCryptoDataController')
const customError = require("../../utils/errors/customError")

class GetTickerDataHandler {
    async handle(query){
        try{
            const type = query.type
            const assetId = query.assetId
            // check if type given
            if(!type){
                throw new customError("Specify type as stock or crypto", 400, 'warn')
            }
            // fetch asset based on type
            let fetchAsset = null
            let fetchAssetHandler = null
            if(type === "stock"){
                fetchAsset = new FetchStock({_id:assetId})
                fetchAssetHandler = new FetchStockHandler()
            }else if(type === "crypto"){
                fetchAsset = new FetchCrypto({_id: assetId})
                fetchAssetHandler = new FetchCryptoHandler()
            }else{
                throw new customError("Invalid type. Expected stock or crypto", 400, 'warn')
            }
            let asset=null
            try{
                // get the asset data
                asset = await fetchAssetHandler.handle(fetchAsset)
            }catch(error){
                throw new customError("No asset found for the given ID", 500, 'error')
            }
            const endDate = (new Date()).toISOString().split('T')[0]
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            const startDateFormatted = startDate.toISOString().split('T')[0];

            let tickerData = {}
            // hit tiingo endpoint based on type
            if(type=== "stock"){
                // prepare data for API request
                const request_params = {
                    startDate:startDateFormatted,
                    endDate:endDate,
                    resampleFreq:"daily"
                }

                const stockPrice = await StockController.getPriceOnDate(request_params, asset.ticker)
                // 

                // fetch daily metric
                const requestParamMetric = {
                    startDate:endDate,
                    endDate:endDate
                }

                let stockMetric = null
                try{
                    stockMetric = await StockController.getDailyMetric(requestParamMetric, asset.ticker)
                }catch(err){
                    if(err.status === 400){
                        stockMetric = null
                    }else{
                        throw err
                    }
                }
                

                tickerData = {
                    priceData:stockPrice,
                    asset:asset,
                    dailyMetric: stockMetric
                }
            }else{
                // fetch crypto prices
                const request_crypto_params = {
                    startDate:startDateFormatted,
                    endDate:endDate,
                    tickers:asset.ticker,
                    resampleFreq:"1day"
                }
                const cryptoPrices = await CryptoController.getPriceOnDate(request_crypto_params)
                // console.log(cryptoPrices[0].priceData)
                let pricesForTicker = []
                if(cryptoPrices && cryptoPrices.length > 0 && cryptoPrices[0].priceData){
                    pricesForTicker = cryptoPrices[0].priceData
                }
                tickerData = {
                    priceData:pricesForTicker,
                    asset:asset,
                    dailyMetric: null
                }
            }

            return tickerData
        }catch(error){
            throw error
        }
        
    }
}

module.exports =GetTickerDataHandler