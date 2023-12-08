const customError = require('../../../utils/errors/customError')
const cryptoStocks = require('./cryptoStocks.mongo')


// load all crypto
async function loadCrypto(cryptoList){
    try{    
        const res = await cryptoStocks.create(cryptoList)
    }catch(error){
        if (error.code === 11000 || error.code === 11001) {
            throw new customError("Initial data of crypto already loaded. Skipping insertion.", 409,'warn');
          } else {
            throw new customError('Failed to load initial crypto data', 500, 'error')
        }
    }
}

// get a crypto based on criteria
async function getCrypto(criteria){
    try{
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Atleast one criteria must be provided to fetch single entry.', 400, 'warn');
        }else{
            const crypto = await cryptoStocks.findOne(criteria);
            return crypto;
        }
    }catch(error){
        if(error.status===400){
            throw error
        }else{
            throw new customError((`Error fetching crypto: ${error.message}`, 500, 'error'));
        }
    }
}


// get all cryptos or based on criteria
async function getCryptos(criteria={}) {
    try{
        const cryptoList = await cryptoStocks.find(criteria);
        return cryptoList;
    }catch (error) {
        throw new customError(`Error fetching cryptoList: ${error.message}`, 500, 'error');
      }
}

// update a single crypto
async function updateCrypto(crypto){
    try{
        await cryptoStocks.findOneAndUpdate({_id:crypto._id}, crypto)
    }catch(error){
        throw new customError(`Error updating crypto: ${error.message}`, 500, 'error')
    }
}


// update a value for multiple tickers
async function updateManyCryptoByTickers(tickers, fieldToUpdate, updateValue){
    try{
        const result = await cryptoStocks.updateMany({ ticker: { $in: tickers } }, { $set: { [fieldToUpdate]: updateValue } });
        return result
    }catch(error){
        throw new customError(`Error updating crypto Tickers: ${error.message}`, 500, 'error')
    }
}


module.exports={
    loadCrypto,
    getCrypto,
    getCryptos,
    updateCrypto,
    updateManyCryptoByTickers
}