const customError = require('../../../utils/errors/customError');
const CryptoServices = require('../../models/cryptoStocks/cryptoStocks.model');

class FetchCryptoListHandler {
  async handle(query) {
    try {
      const cryptoList = await CryptoServices.getCryptos(query.criteria)
      return cryptoList;
    } catch (error) {
        throw new customError(`No crypto list found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchCryptoListHandler;