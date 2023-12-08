const express = require('express');
const router = express.Router();
const customError = require('../../utils/errors/customError')
const {verifyUser} = require('../../middlewares/verifyUser');
const { isAdminUser } = require('../../middlewares/isAdminUser');
const SetNewsCommand = require('../commands/setNewsCommand');
const SetNewsHandler = require('../commandHandlers/setNewsHandler');

router.post('/news',verifyUser, isAdminUser, async (req,res,next)=> {
    try{
        const setNewsCommand = new SetNewsCommand(req.body)
        const setNewshandler = new SetNewsHandler()
        const updateStatus = await setNewshandler.handle(setNewsCommand)
        let message = ""
        if(updateStatus.cryptoStatus === true){
            message = message+"Requested crypto tickers updated."
        }else{
            message = message+"Some of the requested crypto tickers failed to update"
        }

        if(updateStatus.stockStatus === true){
            message = message+"Requested stock tickers updated."
        }else{
            message = message+"Some of the requested stock tickers failed to update"
        }
        res.status(200).json({updateStatus:updateStatus, message: message})
    }catch(error){
        console.log(error)
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }
      
})

module.exports = router