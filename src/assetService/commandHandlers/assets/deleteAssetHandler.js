const AssetService = require('../../models/assets/assets.model');

class DeleteAssetHandler {
    async handle(command) {
        try{
            const assetId = command.assetId
            await AssetService.deleteAsset(assetId)
        }catch(error){
            throw error
        }
    }
}

module.exports = DeleteAssetHandler