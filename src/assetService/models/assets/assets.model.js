const Assets = require('./assets.mongo')
const customError = require('../../../utils/errors/customError')



// add new asset
async function createAsset(assetData) {
    try{
        const asset = await Assets.create({...assetData})
        return asset
    }catch(error){
        throw new customError("Failed to add asset to DB", 500,'error')
        
    }
}

// update asset
async function updateAsset(asset) {
    try{
        // const nonUpdateableFields = ['createdAt', 'updatedAt', '__v', '_id'];

        // // Remove non-updateable fields if they are present
        // const updatedAssetObject = {};

        // Object.keys(asset).forEach(key => {
        // if (!nonUpdateableFields.includes(key)) {
        //     if(key === 'user'){
        //         updatedAssetObject[key] = asset.user._id
        //     }
        //     updatedAssetObject[key] = asset[key];
        // }
        // });


        await Assets.findOneAndUpdate({_id:asset._id},{$set : asset})
    }catch(error){
        console.log(error)
        throw new customError("Internal server error, failed to update asset", 500, 'error')
    }
}


// get a single asset based on  a criteria
async function getAsset(criteria){
    try{
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Atleast one criteria must be provided to fetch single entry.', 400, 'warn');
        }else{
            const asset = await Assets.findOne(criteria).populate('user');
            return asset;
        }
    }catch(error){
        if(error.status===400){
            throw error
        }else{
            throw new customError(`Error fetching asset: ${error.message}`, 500, 'error');
        }
    }
}

// get multiple assets based on criteria or all
async function getAssets(criteria={}){
    try{
        // populate not added. can be added if needed
        const assetList = await Assets.find(criteria);
        return assetList
    } catch (error) {
    throw new customError(`Error fetching asset: ${error.message}`, 500, 'error');
  }
}

// delete Asset
async function deleteAsset(assetId){
    try{
        const result = await Assets.deleteOne({_id:assetId})
        return result.deletedCount === 1
    }catch(error){
        throw new customError(`Failed to delete the asset: ${error.message}`, 500, 'error')
    }
}


module.exports = {
    createAsset,
    updateAsset,
    getAsset,
    getAssets,
    deleteAsset
}