const customError = require('../../utils/errors/customError')
const CreateAssetCommand = require('../commands/assets/createAssetCommand')
const DeleteAssetCommand = require('../commands/assets/deleteAssetCommand')
const UpdateUserCommand = require('../commands/users/updateUserCommand')
const AddCryptoPrepareData = require('../queries/addCryptoPreparedData')
const AddStockPrepareData = require('../queries/addStockPrepareData')
const FetchCrypto = require('../queries/crypto/fetchCrypto')
const FetchStock = require('../queries/stocks/fetchStock')
const AddStockPrepareDataHandler = require('../queryHandlers/addStockPrepareDataHandler')
const AddCrptoPrepareDataHandler = require('../queryHandlers/addcryptoPrepareDataHandler')
const FetchCryptoHandler = require('../queryHandlers/crypto/fetchCryptohandler')
const FetchStockHandler = require('../queryHandlers/stocks/fetchStockHandler')
const CreateAssetHandler = require('./assets/createAssetHandler')
const DeleteAssetHandler = require('./assets/deleteAssetHandler')
const UpdateUserHandler = require('./users/updateUserHandler')

class AddUserAssetHandler{
    async handle(command){
        let asset = null
        try{
            const user = command.user
            const assetPayload = command.assetPayload

            if(!assetPayload.assetId || !assetPayload.quantity || !assetPayload.datePurchased || !assetPayload.type){
                throw new customError("Missing required parameter. Expecting assetId, quantity and datePurchased", 400, 'warn')
            }
            // validate quantity and date - TODO

            let addAssetPrepData = null
            let addAssetPrepDataHandler = null

            // depending on type fetch api data 
            if(assetPayload.type==="stock"){
                addAssetPrepData = new AddStockPrepareData(assetPayload)
                addAssetPrepDataHandler = new AddStockPrepareDataHandler()
            }else if(assetPayload.type === "crypto"){
                addAssetPrepData = new AddCryptoPrepareData(assetPayload)
                addAssetPrepDataHandler = new AddCrptoPrepareDataHandler()
            }else{
                throw new customError("Invalid type. Accepted values- stock or crypto", 400, 'warn')
            }

            // get ticker
            let tickerData = {}
            try{
                tickerData = await addAssetPrepDataHandler.handle(addAssetPrepData)
            }catch(err){
                if(err.status === 400){
                    throw err
                }else{
                    throw new customError("Invalid assetId", 400, 'warn')
                }   
            }
            // create new json object
            const newAsset = {
                user: user,
                type: assetPayload.type,
                ticker: tickerData.ticker,
                quantity: assetPayload.quantity,
                purchasedDate: new Date(assetPayload.datePurchased),
                amountOnPurchase: tickerData.amount
            }

            
            // insert asset
            const createAssetCommand = new CreateAssetCommand(newAsset)
            const createAssetHandler = new CreateAssetHandler()
            asset = await createAssetHandler.handle(createAssetCommand)

            // update user - if fail delete asset
            try{
                asset.user.totalInvestedAmount = asset.user.totalInvestedAmount +  (asset.quantity * asset.amountOnPurchase)
                const updateUserCommand = new UpdateUserCommand(asset.user)
                const updateUserHandler = new UpdateUserHandler()
                await updateUserHandler.handle(updateUserCommand)
            }catch(err){
                throw new customError("Failed to update user", 500, 'error')
            }

            return asset
        }catch(error){
            if(error.message === "Failed to update user"){
                // delete asset

                const deleteAssetCommand = new DeleteAssetCommand(asset._id)
                const deleteAssetHandler = new DeleteAssetHandler()
                await deleteAssetHandler.handle(deleteAssetCommand)

                throw new customError("Failed to insert asset", 500, 'error')
            }else{
                throw error
            }
            
        }
        
    }
}

module.exports = AddUserAssetHandler