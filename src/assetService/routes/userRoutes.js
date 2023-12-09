const express = require('express');
const { verifyUser } = require('../../middlewares/verifyUser');
const { hasUserRole } = require('../../middlewares/hasUserRole');
const AddUserAsset = require('../commands/addUserAsset');
const AddUserAssetHandler = require('../commandHandlers/addUserAssetHandler');
const customError = require('../../utils/errors/customError');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const DeleteUserAsset = require('../commands/deleteUserAsset');
const DeleteUserAssetHandler = require('../commandHandlers/deleteUserAssetHandler');
const FetchAssetList = require('../queries/assets/fetchAssetList');
const FetchAssetListHandler = require('../queryHandlers/assets/fetchAssetListHandler');


router.post('/assets', verifyUser, hasUserRole, 
[   
    // check not exist here only TODO
    body('quantity').isInt().withMessage('Quantity must be a whole number'),
    body('datePurchased')
    .custom((value) => {
      // Check if the date has the format "yyyy-mm-dd"
      //const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Date must be in the format YYYY-MM-DD');
      }

      // Check if the value can be successfully converted to a Date object
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    })
    .withMessage('Invalid date format or value'),
],
async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw new customError(errors.array()[0].msg, 400, 'warn')
        }

        const payload = req.body
        console.log(payload)
        const { user, ...assetData } = req.body;

        const addUserAsset = new AddUserAsset(assetData, user)    
        const addUserAssetHandler = new AddUserAssetHandler()
        const responseData = await addUserAssetHandler.handle(addUserAsset)
        res.status(201).json(responseData)
    }catch(error){
        if(error.status === 400){
            next(error)
        }else{
            next(new customError("Failed to add asset", 500, 'error'))
        }
        
    }
    
})

router.get('/assets', verifyUser, hasUserRole, async (req,res, next)=> {
    try{

        // handle params if needed later

        const fetchAssetList = new FetchAssetList({sold:false})
        const fetchAssetListHandler = new FetchAssetListHandler()
        const assetList = await fetchAssetListHandler.handle(fetchAssetList)
        res.status(200).json(assetList)
    }catch(error){
        next(new customError("Failed to fetch user stocks"))
    }
})


router.post('/assets/:assetId', verifyUser, hasUserRole, async (req, res, next)=> {
    try{
        // get asset id
        const {assetId} = req.params

        const deleteUserAsset = new DeleteUserAsset(assetId)
        const deleteUserAssetHandler = new DeleteUserAssetHandler()
        const updatedAsset = await deleteUserAssetHandler.handle(deleteUserAsset)
        res.status(200).json(updatedAsset)
    }catch(error){
        console.log(error)
        next(new customError("Failed to delete asset", 500, 'error'))
    }    
})




module.exports = router