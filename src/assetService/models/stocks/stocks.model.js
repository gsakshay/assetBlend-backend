const customError = require('../../../utils/errors/customError')
const stocks = require('./stocks.mongo')

// load all stocks
async function loadStocks(stocksList){
    try{    
        const res = await stocks.create(stocksList)
    }catch(error){
        if (error.code === 11000 || error.code === 11001) {
            throw new customError("Initial data of stocks already loaded. Skipping insertion.",409, 'warn');
          } else {
            throw new customError('Failed to load initial stocks data', 500, 'error')
        }
        
    }
}

// get a stock based on criteria
async function getStock(criteria){
    try{
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Atleast one criteria must be provided to fetch single entry.', 400, 'warn');
        }else{
            const stock = await stocks.findOne(criteria);
            return stock;
        }
    }catch(error){
        if(error.status===400){
            throw error
        }else{
            throw new customError(`Error fetching stock: ${error.message}`, 500, 'error');
        }
    }
}

// get stocks, all or based on criteria
async function getStocks(criteria={}) {
    try{
        const stockList = await stocks.find(criteria);
        return stockList;
    }catch (error) {
        throw new customError(`Error fetching stockList: ${error.message}`, 500, 'error');
      }
}

// update stock
async function updateStock(stock){
    try{
        await stocks.findOneAndUpdate({_id:stock._id}, stock)
    }catch(error){
        throw new customError(`Error updating stock: ${error.message}`, 500, 'error')
    }
}

// update on value for set of tickers
async function updateManyStockByTickers(tickers, fieldToUpdate, updateValue){
    try{
        return await stocks.updateMany({ _id: { $in: tickers } }, { $set: { [fieldToUpdate]: updateValue } });
    }catch(error){
        throw new customError(`Error updating stocks Tickers: ${error.message}`, 500, 'error')
    }
}

// get stocks count
async function getStocksCount() {
    try {
        const count = await stocks.countDocuments();
        return count;
    } catch (error) {
        throw new customError(`Failed to get the count of stocks: ${error.message}`, 500, 'error')
    }
}

module.exports={
    loadStocks,
    getStocks,
    getStock,
    updateStock,
    updateManyStockByTickers,
    getStocksCount
}