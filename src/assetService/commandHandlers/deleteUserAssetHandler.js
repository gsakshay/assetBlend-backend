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
            const advisor  = command.advisor // populate in get user and set from there
            if(!assetId){
                throw new customError("Asset Id must be provided"), 400, 'warn'
            }


            // get asset - check  if valid assetId
            const fetchAsset = new FetchAsset({_id:assetId})
            const fetchAssetHandler = new FetchAssetHandler()
            assetData = await fetchAssetHandler.handle(fetchAsset)
            // set sold to true
            assetData.sold = true
            //const { user, ...assetUpdateData } = assetData;
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
                
            }catch(err){
                throw new customError("Failed to update user", 500, 'error')
            }

            // update advisor if exists

            // udpate advisor if exists
            if(advisor !== null){
                try{
                    advisor.totalInvestedAmount = advisor.totalInvestedAmount -  (assetData.quantity * assetData.amountOnPurchase)
                    const updateAdvisorCommand = new UpdateUserCommand(advisor)
                    const updateAdvisorHandler = new UpdateUserHandler()
                    await updateAdvisorHandler.handle(updateAdvisorCommand)
                }catch(e){
                    throw new customError("Failed to udpate advisor data", 500, 'error')
                }
            }
            return assetData
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