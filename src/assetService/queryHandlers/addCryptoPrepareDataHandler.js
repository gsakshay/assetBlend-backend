const customError = require("../../utils/errors/customError")
const CryptoController = require("../../tingoServices/controllers/queryCryptoDataController")
const FetchCrypto = require("../queries/crypto/fetchCrypto")
const FetchCryptoHandler = require("./crypto/fetchCryptohandler")

class AddCrptoPrepareDataHandler{
    async handle(query){
        try{
            const assetPayload = query.assetPayload


            // get asset data to get ticker name
            const fetchStockCommand = new FetchCrypto({_id:assetPayload.assetId})
            const fetchstockCommandHandler = new FetchCryptoHandler()
            const crypto = await fetchstockCommandHandler.handle(fetchStockCommand)

            // prepare data for API request
            const request_params = {
                tickers:crypto.ticker,
                startDate:assetPayload.datePurchased,
                endDate:assetPayload.datePurchased,
                resampleFreq:"1day"
            }

            const cryptoPrice = await CryptoController.getPriceOnDate(request_params)

            const cryptoData = {
                "ticker": crypto.ticker,
                "amount": cryptoPrice.priceData[0].close
            }

            return cryptoData
        }catch(error){
            console.log(error)
            if(error.status === 400){
                throw error
            }else{
                throw customError("Failed to prepare required data to add asset", 500, 'error')
            }
        }
        

    }
}

module.exports = AddCrptoPrepareDataHandler