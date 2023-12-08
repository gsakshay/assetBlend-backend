const customError = require('../../../utils/errors/customError');
const StockServices = require('../../models/stocks/stocks.model');

class FetchStockListHandler {
  async handle(query) {
    try {
      const stockList = await StockServices.getStocks(query.criteria)
      return stockList;
    } catch (error) {
        throw new customError(`No stock found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchStockListHandler;