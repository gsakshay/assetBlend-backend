const customError = require("../../../utils/errors/customError");
const CryptoServices = require('../../models/cryptoStocks/cryptoStocks.model');

class FetchCryptoCountHandler {
  async handle() {
    try {
      const count = await CryptoServices.getCryptoCount();
      return count;
    } catch (error) {
      throw new customError(
        `Failed to get the count of crypto`,
        400,
        "warn"
      );
    }
  }
}

module.exports = FetchCryptoCountHandler;
