/** @format */

const FetchAssetList = require("../queries/assets/fetchAssetList")
const FetchAssetListHandler = require("./assets/fetchAssetListHandler")
const StockController = require("../../tingoServices/controllers/queryStockDataController")
const computeProfitLoss = require("../../utils/helpers/tiingoHelpers/computeProfitLoss")
const CryptoController = require("../../tingoServices/controllers/queryCryptoDataController")
const customError = require("../../utils/errors/customError")

class FetchUserDashboardHandler {
	async handle(query) {
		try {
			const userData = query.user
			let dashboardData = {
				user: userData,
			}
			let totalCurrentValue = 0

			// get user assets:
			const fetchUserAssets = new FetchAssetList({
				user: userData._id,
				sold: false,
			})
			const fetchAssetListHandler = new FetchAssetListHandler()
			const userAssets = await fetchAssetListHandler.handle(fetchUserAssets)

			// add asset count
			dashboardData.no_of_assets = userAssets
				.filter((item) => item.sold === false)
				.reduce((sum, item) => sum + 1, 0)

			if (userAssets.length > 0) {
				// get 5
				const filteredUserAssets = userAssets.slice(0, 4)

				// separate into stocks and crypto
				const cryptoAssets = filteredUserAssets.filter(
					(item) => item.type === "crypto"
				)
				const stockAssets = filteredUserAssets.filter(
					(item) => item.type !== "crypto"
				)

				dashboardData.stocks = null
				dashboardData.crypto = null

				// Fetch stock result
				// handle exceptions
				dashboardData.stocks = await Promise.all(
					stockAssets.map(async (stockData) => {
						let latestPrice = null
						let profit = null
						let dailyMetric = null
						const processedStockData = stockData.toObject()
						// get latest price
						const latestStockData = await StockController.getPriceOnDate(
							{},
							stockData.ticker
						)
						latestPrice = latestStockData[0]

						// compute profit loss
						profit = await computeProfitLoss(
							stockData.quantity,
							latestPrice.close,
							stockData.amountOnPurchase
						)
						// get metric data for the stock on latest date
						const latestDate = latestStockData[0].date.split("T")[0]
						totalCurrentValue = totalCurrentValue + profit.currentValue
						const stock_req_params = {
							startDate: latestDate,
							endDate: latestDate,
						}
						try {
							dailyMetric = await StockController.getDailyMetric(
								stock_req_params,
								stockData.ticker
							)
						} catch (err) {
							if (err.status === 400) {
								dailyMetric = null
							} else {
								throw err
							}
						}
						return {
							assetData: processedStockData,
							latestPrice: latestPrice,
							dailyMetric: dailyMetric,
							profit: profit,
						}

						// get ticker info?
					})
				)

				// Fetch crypto result
				const currDate = new Date().toISOString().split("T")[0]
				const cryptoRequestParams = {
					tickers: cryptoAssets.map((obj) => obj.ticker).join(","),
					resampleFreq: "1day",
				}
				let cryptoLatestPrices = []
				try {
					cryptoLatestPrices = await CryptoController.getPriceOnDate(
						cryptoRequestParams
					)
				} catch (e) {
					if (e.status === 400) {
						console.log("Failed to fetch data for all tickers")
					} else {
						throw err
					}
				}

				// include latest price for each asset from the result
				if (cryptoLatestPrices.length > 0) {
					dashboardData.crypto = await Promise.all(
						cryptoAssets.map(async (cryptoData) => {
							const processedCryptoData = cryptoData.toObject()
							let latestPrice = null
							let profit = null
							let dailyMetric = null
							const priceDataForCrypto = cryptoLatestPrices.find(
								(latestPriceData) =>
									latestPriceData.ticker === cryptoData.ticker
							)
							if (
								priceDataForCrypto &&
								priceDataForCrypto.priceData &&
								priceDataForCrypto.priceData.length > 0
							) {
								latestPrice = priceDataForCrypto.priceData[0]
							}
							// compute profit loss
							profit = await computeProfitLoss(
								cryptoData.quantity,
								latestPrice.close,
								cryptoData.amountOnPurchase
							)
							return {
								assetData: processedCryptoData,
								latestPrice: latestPrice,
								dailyMetric: dailyMetric,
								profit: profit,
							}

							// fetch ticker data?
						})
					)
				} else {
					dashboardData.crypto = await Promise.all(
						cryptoAssets.map(async (cryptoData) => {
							const processedCryptoData = cryptoData.toObject()
							let latestPrice = null
							let profit = null
							let dailyMetric = null
							return {
								assetData: processedCryptoData,
								latestPrice: latestPrice,
								dailyMetric: dailyMetric,
								profit: profit,
							}
						})
					)
				}
			}

			// overall profit/loss
			dashboardData.overAll_profitLoss = null
			dashboardData.overAll_profitLoss =
				totalCurrentValue - userData.totalInvestedAmount
			// overall profit/loss %
			dashboardData.overAllPercent_profitLoss = null
			dashboardData.overAllPercent_profitLoss =
				(dashboardData.overAll_profitLoss / userData.totalInvestedAmount) * 100
			// return
			return dashboardData
		} catch (error) {
			throw new customError(
				"Failed to extract data for user dashboard",
				500,
				"error"
			)
		}
	}
}

module.exports = FetchUserDashboardHandler
