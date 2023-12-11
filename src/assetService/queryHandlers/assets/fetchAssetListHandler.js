const customError = require('../../../utils/errors/customError');
const AssetServices = require('../../models/assets/assets.model');

class FetchAssetListHandler {
  async handle(query) {
    try {
      const assetList = await AssetServices.getAssets(query.criteria)
      return assetList;
    } catch (error) {
        throw new customError(`No asset list found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchAssetListHandler;