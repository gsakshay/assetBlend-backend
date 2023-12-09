const customError = require('../../../utils/errors/customError')
const AssetService = require('../../models/assets/assets.model');

class CreateAssetHandler {
  async handle(command) {
    try {
      const asset = await AssetService.createAsset(command.assetPayload)
      return asset;
    } catch (error) {
        console.log(error)
        throw error;
    }
  }
}

module.exports = CreateAssetHandler;