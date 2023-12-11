const express = require('express');
const customError = require('../../utils/errors/customError');
const FetchStock = require('../queries/stocks/fetchStock');
const FetchStockHandler = require('../queryHandlers/stocks/fetchStockHandler');
const FetchCrypto = require('../queries/crypto/fetchCrypto');
const FetchCryptoHandler = require('../queryHandlers/crypto/fetchCryptohandler');
const GetTickerData = require('../queries/getTickerData');
const GetTickerDataHandler = require('../queryHandlers/getTickerDataHandler');
const router = express.Router();

router.get('/:assetId', async (req, res, next) => {
    try{
        const getTicker = new GetTickerData(req.query.type, req.params.assetId)
        const getTickerHandler = new GetTickerDataHandler()
        const tickerData = await getTickerHandler.handle(getTicker)
        res.status(200).json(tickerData)
    }catch(error){
        next(new customError("Failed to fetch asset data", 500, 'error'))
    }
}) 

module.exports = router