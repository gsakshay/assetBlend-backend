const customError = require('../../utils/errors/customError')
const fetchTiingoData = require('../../utils/helpers/tiingoHelpers/getRequest')

getPriceOnDate = async function(requestParams){
    try{
        // prepare endpoint
        const endpoint = "/tiingo/crypto/prices"
        const crypto_data = await fetchTiingoData(endpoint, requestParams)
        return crypto_data
    }catch(error){
        if(error.status === 400){
            console.log("In 400 ERROR Crypto")
            throw error
        }else{
            console.log("Failed for",requestParams,error)
            throw new customError("Failed to fetch price for the given date", 500, 'error')
        }   
        
    }
    
}

module.exports = {
    getPriceOnDate,
}