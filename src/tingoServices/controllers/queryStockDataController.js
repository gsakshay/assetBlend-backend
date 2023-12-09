const customError = require('../../utils/errors/customError')
const fetchTiingoData = require('../../utils/helpers/tiingoHelpers/getRequest')

getPriceOnDate = async function(requestParams, tickerName){
    try{
        // prepare endpoint
        const raw_endpoint = "/tiingo/daily/<ticker>/prices"
        const endpoint = raw_endpoint.replace("<ticker>",tickerName)

        const stock_data = await fetchTiingoData(endpoint, requestParams)
        if(stock_data.length === 0 || stock_data.length > 1){
            throw new customError("Didnot receive data or received multiple entries", 500, 'error')
        }
        return stock_data[0]
    }catch(error){
        console.log(error)
        throw new customError("Failed to fetch price for the given date", 500, 'error')
    }
    
}

module.exports = {
    getPriceOnDate,
}