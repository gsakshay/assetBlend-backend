const customError = require('../../../utils/errors/customError');
const AssetServices = require('../../models/assets/assets.model');

class FetchAssetHandler {
  async handle(query) {
    try {
      const asset = await AssetServices.getAsset(query.criteria)
      return asset;
    } catch (error) {
        throw new customError(`No asset found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchAssetHandler