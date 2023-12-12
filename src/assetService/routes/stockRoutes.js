/** @format */

const express = require("express")
const FetchStockList = require("../queries/stocks/fetchStockList")
const FetchStockListHandler = require("../queryHandlers/stocks/fetchStockListHandler")
const FetchStock = require("../queries/stocks/fetchStock")
const FetchStockHandler = require("../queryHandlers/stocks/fetchStockHandler")
const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		// get params and
		const name = req.query.name

		console.log(req, "name here")

		// construct criteria
		let criteria = {}
		if (name) {
			const regex = new RegExp(name, "i")
			criteria = { name: { $regex: regex } }
		}

		const fetchStockList = new FetchStockList(criteria)
		const fetchStockListHandler = new FetchStockListHandler()
		const stockList = await fetchStockListHandler.handle(fetchStockList)
		// console.log(stockList)
		res.status(200).json(stockList)
	} catch (error) {
		next(new customError("Failed to fetch all stock", 500, "error"))
	}
})

router.get("/:stockId", async (req, res, next) => {
	try {
		const stockId = req.params.stockId
		const fetchStock = new FetchStock({ _id: stockId })
		const fetchStockHandler = new FetchStockHandler()
		try {
			const stockData = await fetchStockHandler.handle(fetchStock)
			res.status(200).json(stockData)
		} catch (err) {
			next(new customError(" Please provide a valid stock id", 400, "warn"))
		}
	} catch (error) {
		next(new customError("Failed to fetch given role", 500, "error"))
	}
})

module.exports = router
