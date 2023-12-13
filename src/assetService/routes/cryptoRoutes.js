const express = require('express');
const FetchCryptoList = require('../queries/crypto/fetchCryptoList');
const FetchCrypto = require('../queries/crypto/fetchCrypto');
const FetchCryptoHandler = require('../queryHandlers/crypto/fetchCryptoHandler');
const customError = require('../../utils/errors/customError');
const FetchCryptoListHandler = require('../queryHandlers/crypto/fetchCryptoListHandler');
const router = express.Router();

router.get("/", async (req, res, next)=> {
    try{
        // get params and 
        const name = req.query.name
        
        // construct criteria
        let criteria = {}
        if(name){
            const regex = new RegExp(name, 'i');
            criteria = { name: { $regex: regex } }
        }

        const fetchCryptoList = new FetchCryptoList(criteria)
        const fetchCryptoListHandler = new FetchCryptoListHandler()
        const cryptoList = await fetchCryptoListHandler.handle(fetchCryptoList)
        res.status(200).json(cryptoList)
    }catch(error){
        next(new customError('Failed to fetch all crypto', 500, 'error'))
    }
})

router.get("/:cryptoId", async (req,res,next)=> {
    try{
        const cryptoId = req.params.cryptoId
        const fetchCrypto = new FetchCrypto({_id:cryptoId})
        const fetchCryptoHandler = new FetchCryptoHandler()
        try{
            const cryptoData = await fetchCryptoHandler.handle(fetchCrypto)
            res.status(200).json(cryptoData)
        }catch(err){
            next(new customError(" Please provide a valid crypto id", 400, 'warn'))
        }
        
    }catch(error){
        console.log(error)
        next(new customError("Failed to fetch given role", 500, 'error'))
    }
})

module.exports = router