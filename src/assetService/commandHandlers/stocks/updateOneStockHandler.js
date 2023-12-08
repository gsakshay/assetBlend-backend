const stockService = require('../../models/stocks/stocks.model')
class UpdateOneStockHandler{
    async handle(command){
        try{
            const stock = command.stock
            await stockService.updateStock(stock)
        }catch(error){
            throw error
        }
    }
}

module.exports = UpdateOneStockHandler