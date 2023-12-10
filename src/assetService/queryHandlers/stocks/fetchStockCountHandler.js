const customError = require("../../../utils/errors/customError");
const StockServices = require("../../models/stocks/stocks.model");

class FetchStockCountHandler {
  async handle() {
    try {
      const count = await StockServices.getStocksCount();
      return count;
    } catch (error) {
      throw new customError(`Failed to get the count of stocks`, 400, "warn");
    }
  }
}

module.exports = FetchStockCountHandler;
