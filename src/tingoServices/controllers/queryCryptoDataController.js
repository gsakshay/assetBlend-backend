const customError = require('../../utils/errors/customError')
const fetchTiingoData = require('../../utils/helpers/tiingoHelpers/getRequest')

getPriceOnDate = async function(requestParams){
    try{
        // prepare endpoint
        const endpoint = "/tiingo/crypto/prices"
        const crypto_data = await fetchTiingoData(endpoint, requestParams)
        if(crypto_data.length === 0 || crypto_data.length > 1){
            throw new customError("Didnot receive data or received multiple entries", 500, 'error')
        }
        return crypto_data[0]
    }catch(error){
        throw new customError("Failed to fetch price for the given date", 500, 'error')
    }
    
}

module.exports = {
    getPriceOnDate,
}