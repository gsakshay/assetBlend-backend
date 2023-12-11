const stockService = require('../../models/stocks/stocks.model')

class LoadStocksHandler {
    async handle(command){
        try{
            await stockService.loadStocks(command.stocksList)
            return
        }catch(error){
            throw error
        }
    }
}

module.exports = LoadStocksHandler