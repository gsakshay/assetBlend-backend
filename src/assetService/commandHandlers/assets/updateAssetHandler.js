const AssetService = require('../../models/assets/assets.model');

class UpdateAssetHandler {
    async handle(command) {
        try{
            const assetData = command.assetData
            await AssetService.updateAsset(assetData)
        }catch(error){
            throw error
        }
    }
}

module.exports = UpdateAssetHandler