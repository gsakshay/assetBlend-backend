const customError = require("../../utils/errors/customError")
const UpdateAssetCommand = require("../commands/assets/updateAssetCommand")
const UpdateUserCommand = require("../commands/users/updateUserCommand")
const FetchAsset = require("../queries/assets/fetchAsset")
const FetchAssetHandler = require("../queryHandlers/assets/fetchAssetHandler")
const UpdateAssetHandler = require("./assets/updateAssetHandler")
const UpdateUserHandler = require("./users/updateUserHandler")

class DeleteUserAssetHandler{
    
    async handle(command){
        let assetData = null
        try{
            const assetId = command.assetId
            if(!assetId){
                throw new customError("Asset Id must be provided"), 400, 'warn'
            }


            // get asset - check  if valid assetId
            const fetchAsset = new FetchAsset({_id:assetId})
            const fetchAssetHandler = new FetchAssetHandler()
            assetData = await fetchAssetHandler.handle(fetchAsset)
            // set sold to true
            assetData.sold = true
            const { user, ...assetUpdateData } = assetData;
            //console.log("Asset data bfr udate",assetData)
            // update asset
            const updateAssetCommand = new UpdateAssetCommand(assetData)
            const updateAssetHandler  = new UpdateAssetHandler()
            await updateAssetHandler.handle(updateAssetCommand)

            try{
                // compute the new amount
                assetData.user.totalInvestedAmount = assetData.user.totalInvestedAmount - (assetData.quantity * assetData.amountOnPurchase)
                // update user invested amount
                const updateUserCommand = new UpdateUserCommand(assetData.user)
                const updateUserHandler = new UpdateUserHandler()
                await updateUserHandler.handle(updateUserCommand)
                return assetData
            }catch(err){
                throw new customError("Failed to update user", 500, 'error')
            }
            
        }catch(error){
            if(error.message === "Failed to update user"){
                // revert the asset 
                assetData.sold = false
                const updateAssetCommand = new UpdateAssetCommand(assetData)
                const updateAssetHandler  = new UpdateAssetHandler()
                await updateAssetHandler.handle(updateAssetCommand)
                throw new customError("Failed to delete Asset", 500, 'error')
            }
            throw error
        }
            
    }
}

module.exports = DeleteUserAssetHandler