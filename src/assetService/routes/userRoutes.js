/** @format */

const express = require("express")
const { verifyUser } = require("../../middlewares/verifyUser")
const { hasUserRole } = require("../../middlewares/hasUserRole")
const AddUserAsset = require("../commands/addUserAsset")
const AddUserAssetHandler = require("../commandHandlers/addUserAssetHandler")
const customError = require("../../utils/errors/customError")
const router = express.Router()
const { body, validationResult } = require("express-validator")
const DeleteUserAsset = require("../commands/deleteUserAsset")
const DeleteUserAssetHandler = require("../commandHandlers/deleteUserAssetHandler")
const FetchAssetList = require("../queries/assets/fetchAssetList")
const FetchAssetListHandler = require("../queryHandlers/assets/fetchAssetListHandler")
const AddAdvisorCommand = require("../commands/addAdvisorCommand")
const AddAdvisorHandler = require("../commandHandlers/AddAdvisorHandler")
const DeleteAdvisor = require("../commands/deleteAdvisor")
const DeleteAdvisorHandler = require("../commandHandlers/deleteAdvisorHandler")
const FetchUserDashboard = require("../queries/fetchUserDashboard")
const FetchUserDashboardHandler = require("../queryHandlers/fetchUserDashboardHandler")

router.post(
	"/assets",
	verifyUser,
	hasUserRole,
	[
		body("quantity").isInt().withMessage("Quantity must be a whole number"),
		body("datePurchased")
			.custom((value) => {
				// Check if the date has the format "yyyy-mm-dd"
				if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
					throw new Error("Date must be in the format YYYY-MM-DD")
				}

				// Check if the value can be successfully converted to a Date object
				const date = new Date(value)
				return date instanceof Date && !isNaN(date)
			})
			.withMessage("Invalid date format or value"),
	],
	async (req, res, next) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				throw new customError(errors.array()[0].msg, 400, "warn")
			}

			const { user, ...assetData } = req.body

			const addUserAsset = new AddUserAsset(assetData, user)
			const addUserAssetHandler = new AddUserAssetHandler()
			const responseData = await addUserAssetHandler.handle(addUserAsset)
			res.status(200).json(responseData)
		} catch (error) {
			console.log(error)
			if (error.status === 400) {
				next(error)
			} else {
				next(new customError("Failed to add asset", 500, "error"))
			}
		}
	}
)

router.get("/assets", verifyUser, hasUserRole, async (req, res, next) => {
	try {
		// handle params if needed later
		const fetchAssetList = new FetchAssetList({
			sold: false,
			user: req.body.user._id,
		})
		const fetchAssetListHandler = new FetchAssetListHandler()
		const assetList = await fetchAssetListHandler.handle(fetchAssetList)
		res.status(200).json(assetList)
	} catch (error) {
		next(new customError("Failed to fetch user stocks", 500, "error"))
	}
})

router.post(
	"/assets/:assetId",
	verifyUser,
	hasUserRole,
	async (req, res, next) => {
		try {
			// get asset id
			const { assetId } = req.params
			const advisor = req.body.user.advisor // pass user to
			const deleteUserAsset = new DeleteUserAsset(assetId, advisor)
			const deleteUserAssetHandler = new DeleteUserAssetHandler()
			const updatedAsset = await deleteUserAssetHandler.handle(deleteUserAsset)
			res.status(200).json(updatedAsset)
		} catch (error) {
			next(new customError("Failed to delete asset", 500, "error"))
		}
	}
)

router.post(
	"/addAdvisor/:advisorId",
	verifyUser,
	hasUserRole,
	async (req, res, next) => {
		try {
			const { advisorId } = req.params
			const addAdvisor = new AddAdvisorCommand(req.body.user, advisorId)
			const addAdvisorHandler = new AddAdvisorHandler()
			const updatedUser = await addAdvisorHandler.handle(addAdvisor)
			res.status(200).json(updatedUser)
		} catch (error) {
			next(new customError("Failed to add advisor", 500, "error"))
		}
	}
)

router.post(
	"/removeAdvisor",
	verifyUser,
	hasUserRole,
	async (req, res, next) => {
		try {
			const deleteAdvisorCommand = new DeleteAdvisor(req.body.user)
			const deleteAdvisorHandler = new DeleteAdvisorHandler()
			const advisorRemovedUser = await deleteAdvisorHandler.handle(
				deleteAdvisorCommand
			)
			res.status(200).json(advisorRemovedUser)
		} catch (error) {
			next(new customError("Failed to delete advisor", 500, "error"))
		}
	}
)

router.get("/dashboard", verifyUser, hasUserRole, async (req, res, next) => {
	try {
		const fetchDashboardData = new FetchUserDashboard(req.body.user)
		const fetchDashboardHandler = new FetchUserDashboardHandler()
		const dashboardData = await fetchDashboardHandler.handle(fetchDashboardData)
		res.status(200).json(dashboardData)
	} catch (error) {
		console.log("ROUTE ERROR", error)
		next(new customError("Failed to fetch dashboard details", 500, "error"))
	}
})

module.exports = router
