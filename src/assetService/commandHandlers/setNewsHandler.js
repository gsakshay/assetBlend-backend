const customError = require("../../utils/errors/customError");
const UpdateCryptos = require("../commands/crypto/updateCryptos");
const UpdateStocks = require("../commands/stocks/updateStocks");
const UpdateCryptosHandler = require("./crypto/updateCryptosHandler");
const UpdateStocksHandler = require("./stocks/updateStocksHandler");

class SetNewsHandler{
    async handle(command) {
        try{
            const payload = command.payload
            let cryptoStatus = false
            let stockStatus = false

            if(!payload.crypto || !payload.stock){
                throw new customError("Missing parameters. Expected crypto and stock", 400, 'warn')
            }
            const { crypto = [], stock = [] } = payload;
            // set crypto news
            const updateCryptoCommand = new UpdateCryptos(crypto, 'isNews', true)
            const updateCryptoHandler = new UpdateCryptosHandler()

            // check if all tickers in request were udpated
            const cryptoUpdateResult = await updateCryptoHandler.handle(updateCryptoCommand)
            if(cryptoUpdateResult.modifiedCount === crypto.length){
                cryptoStatus = true
            }

            // set stocks news
            const updateStockCommand = new UpdateStocks(stock, 'isNews', true)
            const updateStockHandler = new UpdateStocksHandler()
            const stockUpdateResult = await updateStockHandler.handle(updateStockCommand)
            if(stockUpdateResult.modifiedCount === stock.length){
                stockStatus = true
            }
            return {
                cryptoStatus : cryptoStatus,
                stockStatus : stockStatus
            }
        }catch(error){
            console.log(error)
            throw new customError("Failed to set News data", 500, 'error')
        }
        
    }
}

module.exports = SetNewsHandler