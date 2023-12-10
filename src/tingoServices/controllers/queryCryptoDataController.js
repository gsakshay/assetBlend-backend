const customError = require('../../utils/errors/customError')
const fetchTiingoData = require('../../utils/helpers/tiingoHelpers/getRequest')

getPriceOnDate = async function(requestParams){
    try{
        // prepare endpoint
        const endpoint = "/tiingo/crypto/prices"
        const crypto_data = await fetchTiingoData(endpoint, requestParams)
        if(crypto_data.length === 0){
            throw new customError("Didnot receive data", 500, 'error')
        }
        return crypto_data
    }catch(error){
        throw new customError("Failed to fetch price for the given date", 500, 'error')
    }
    
}

module.exports = {
    getPriceOnDate,
}