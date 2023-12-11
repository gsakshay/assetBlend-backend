const customError = require('../../../utils/errors/customError');
const StockServices = require('../../models/stocks/stocks.model');

class FetchStockHandler {
  async handle(query) {
    try {
      const stock = await StockServices.getStock(query.criteria)
      return stock;
    } catch (error) {
        throw new customError(`No stock found with given criteria`, 400, 'warn');
    }
  }
}

module.exports = FetchStockHandler;