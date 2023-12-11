const cryptoService = require('../../models/cryptoStocks/cryptoStocks.model')

class UpdateCryptosHandler {
    async handle(command){
        try{
            const tickers = command.tickers
            const fieldToUpdate = command.fieldToUpdate
            const updateValue = command.updateValue
            const response = await cryptoService.updateManyCryptoByTickers(tickers,fieldToUpdate,updateValue)
            return response
        }catch(error) {
            throw error
        }
    }
}

module.exports = UpdateCryptosHandler