/** @format */
const LoadCryptoHandler = require('../../assetService/commandHandlers/crypto/loadCryptoHandler')
const LoadStocksHandler = require('../../assetService/commandHandlers/stocks/loadStocksHandler')
const LoadStocksCommand = require('../../assetService/commands/stocks/loadStocksCommand')
const customError = require('../../utils/errors/customError')
const LoadCryptoCommand = require('../../assetService/commands/crypto/loadCryptoCommand')
const fetchTiingoData = require('../../utils/helpers/tiingoHelpers/getRequest')
const constants = require('../../utils/constants/index')

loadAssets = async function() {
    try{
        const endpoint = '/tiingo/fundamentals/meta'
        //requiredFields = { permaTicker, ticker, name, isActive, isADR, reportingCurrency }
        const raw_stocks_data = await fetchTiingoData(endpoint)
        const preloadStockList = constants.preLoadStocks
        // filter
        const filteredData = raw_stocks_data.filter(item => {
            return preloadStockList.includes(item.ticker.toUpperCase());
            // return (
            //   item.isActive === true &&
            //   item.isADR === true
            // );
          });
        // extract required fields
        const stock_filtered_columns = filteredData.map(({ ticker, name, isActive, isADR, reportingCurrency }) => ({
            ticker,
            name,
            isActive,
            isADR,
            reportingCurrency,
          }));

        // load to DB
        const loadStocksCommand= new LoadStocksCommand(stock_filtered_columns)
        const loadStockshandler = new LoadStocksHandler()
        await loadStockshandler.handle(loadStocksCommand)

        return
    }catch(error){
        if(error.status === 409){
            throw error
        }else{
            throw new customError("Failed to fetch stocks from Tiingo",500,"error")
        }
    }
    
}


loadCrypto = async function(){
    try{
        // TODO - add top 50 crypto
        const crypto_ticker_list = constants.preLoadedCrypto
        const columnsOrder = ['ticker','name', 'baseCurrency', 'quoteCurrency']
        const tickers = crypto_ticker_list.join(',');
        const columns = columnsOrder.join(',');
        const endpoint = '/tiingo/crypto'
        const parameters = {
            'tickers':tickers,
            'columns':columns
        }
        const raw_crypto_data = await fetchTiingoData(endpoint,parameters)

        // load to DB
        const cryptoLoadCommand = new LoadCryptoCommand(raw_crypto_data)
        const cryptoLoadHandler = new LoadCryptoHandler()
        await cryptoLoadHandler.handle(cryptoLoadCommand)

        return
    }catch(error){
        if(error.status === 409){
            throw error
        }else{
            throw new customError("Failed to fetch crypto from Tiingo",500,"error")
        }
    }
}

module.exports = {
    loadAssets,
    loadCrypto
}