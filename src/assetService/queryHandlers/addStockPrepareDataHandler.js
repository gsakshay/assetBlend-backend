const customError = require("../../utils/errors/customError")
const FetchStock = require("../queries/stocks/fetchStock")
const FetchStockHandler = require("./stocks/fetchStockHandler")
const StockController = require("../../tingoServices/controllers/queryStockDataController")

class AddStockPrepareDataHandler{
    async handle(query){
        try{
            const assetPayload = query.assetPayload


            // get asset data to get ticker name
            const fetchStockCommand = new FetchStock({_id:assetPayload.assetId})
            const fetchstockCommandHandler = new FetchStockHandler()
            const stock = await fetchstockCommandHandler.handle(fetchStockCommand)

            // prepare data for API request
            const request_params = {
                startDate:assetPayload.datePurchased,
                endDate:assetPayload.datePurchased,
                resampleFreq:"daily"
            }

            const stockPrice = await StockController.getPriceOnDate(request_params, stock.ticker)
            if(stockPrice.length > 1){
                throw new customError("Received multiple data", 500, 'error')
            }
            const stockData = {
                "ticker": stock.ticker,
                "amount": stockPrice[0].close
            }

            return stockData
        }catch(error){
            if(error.status === 400){
                throw error
            }else{
                throw customError("Failed to prepare required data to add asset", 500, 'error')
            }
        }
        

    }
}

module.exports = AddStockPrepareDataHandler