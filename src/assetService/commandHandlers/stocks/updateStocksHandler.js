const stockService = require('../../models/stocks/stocks.model')
class UpdateStocksHandler {
    async handle(command){
        try{
            const tickers = command.tickers
            const fieldToUpdate = command.fieldToUpdate
            const updateValue = command.updateValue
           return await stockService.updateManyStockByTickers(tickers,fieldToUpdate,updateValue)
        }catch(error) {
            throw error
        }
    }
}

module.exports = UpdateStocksHandler