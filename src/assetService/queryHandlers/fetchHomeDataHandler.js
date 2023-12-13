/** @format */

const customError = require("../../utils/errors/customError")
const FetchCryptoList = require("../queries/crypto/fetchCryptoList")
const GetTickerData = require("../queries/getTickerData")
const FetchStockList = require("../queries/stocks/fetchStockList")
const FetchCryptoListHandler = require("./crypto/fetchCryptoListHandler")
const GetTickerDataHandler = require("./getTickerDataHandler")
const FetchStockListHandler = require("./stocks/fetchStockListHandler")

class FetchHomeDataHandler {
	async handle(query) {
		try {
			// get list of stock for new
			const fetchStockList = new FetchStockList({ isNews: true })
			const fetchStockHListHandler = new FetchStockListHandler()
			const stockData = await fetchStockHListHandler.handle(fetchStockList)
			const stockList = stockData.map((entry) => {
				const stockObj = entry.toObject()
				return { ...stockObj, type: "stock" }
			})

			// get list of crypto for new
			const fetchCryptoList = new FetchCryptoList({ isNews: true })
			const fetchCryptoListHandler = new FetchCryptoListHandler()
			const cryptoData = await fetchCryptoListHandler.handle(fetchCryptoList)
			const cryptoList = cryptoData.map((entry) => {
				const cryptoObj = entry.toObject()
				return { ...cryptoObj, type: "crypto" }
			})
			const allAssets = [...stockList, ...cryptoList]

			// const fetchTickerDatahandler = new GetTickerDataHandler()
			// let fetchTickerData = null

			// const allAssetsData = await Promise.all(allAssets.map(async (asset)=> {
			//     fetchTickerData = new GetTickerData(asset.type, asset._id)
			//     const tickerData = await fetchTickerDatahandler.handle(fetchTickerData)
			//     // tickerData.asset = {...asset}
			//     // console.log(tickerData)
			//     return tickerData
			// }))
			// return allAssetsData
			return allAssets
		} catch (error) {
			console.log(error)
			throw new customError(
				"Failed to fetch data for landing page",
				500,
				"error"
			)
		}
	}
}

module.exports = FetchHomeDataHandler
