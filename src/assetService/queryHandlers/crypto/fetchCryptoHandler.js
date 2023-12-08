const customError = require('../../../utils/errors/customError');
const CryptoServices = require('../../models/cryptoStocks/cryptoStocks.model');

class FetchCryptoHandler {
  async handle(query) {
    try {
      const crypto = await CryptoServices.getCrypto(query.criteria)
      return crypto;
    } catch (error) {
        throw new customError(`No crypto found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchCryptoHandler;