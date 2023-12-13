/** @format */

const express = require("express")
const customError = require("../../utils/errors/customError")
const { verifyUser } = require("../../middlewares/verifyUser")
const FetchUserByRole = require("../queries/fetchAdvisorList")
const FetchUserByRoleHandler = require("../queryHandlers/fetchAdvisorListHandler")
const router = express.Router()
const FetchUserList = require("../queries/users/fetchUserList")
const FetchUserListHandler = require("../queryHandlers/users/fetchUserListHandler")
const FetchAssetList = require("../queries/assets/fetchAssetList")
const FetchAssetListHandler = require("../queryHandlers/assets/fetchAssetListHandler")
const commonUtils = require("../../utils/helpers/commonUtils")
const DeleteUserAsset = require("../commands/deleteUserAsset")
const DeleteUserAssetHandler = require("../commandHandlers/deleteUserAssetHandler")
const FetchUser = require("../queries/users/fetchUser")
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler")
const AddUserAsset = require("../commands/addUserAsset")
const AddUserAssetHandler = require("../commandHandlers/addUserAssetHandler")
const { body, validationResult } = require("express-validator")
const constants = require("../../utils/constants/index")

router.get("/", verifyUser, async (req, res, next) => {
	try {
		const fetchAdvisors = new FetchUserByRole(constants.ROLES.ADVISOR)
		const fetchAdvisorsHandler = new FetchUserByRoleHandler()
		const advisorList = await fetchAdvisorsHandler.handle(fetchAdvisors)
		res.status(200).json(advisorList)
	} catch (error) {
		console.log(error)
		next(new customError("failed to fetch advisors list", 500, "error"))
	}
})

router.get("/dashboard", verifyUser, async (req, res, next) => {
	try {
		const { _id } = req.body.user

		const advisorQuery = new FetchUserList({ advisor: _id })
		const fetchUserListHandler = new FetchUserListHandler()
		const clientsList = await fetchUserListHandler.handle(advisorQuery)

		let assetsCount = 0
		const fetchAssetListHandler = new FetchAssetListHandler()
		for (let i = 0; i < clientsList.length; i++) {
			const { _id } = clientsList[i]
			const query = new FetchAssetList({ user: _id })
			const assetsList = await fetchAssetListHandler.handle(query)

			for (let j = 0; j < assetsList.length; j++) {
				if (!assetsList[j].sold) {
					// const { quantity } = assetsList[j]
					assetsCount += 1
				}
			}
		}

		const advisorDashboardData = {}
		advisorDashboardData.totalClients = clientsList.length
		advisorDashboardData.totalAssets = assetsCount

		res.status(200).send({ advisorDashboardData })
	} catch (error) {
		next(new customError("Failed to fetch advisor dashboard", 500, "error"))
	}
})

router.get("/advisee", verifyUser, async (req, res, next) => {
	try {
		const { _id } = req.body.user

		const advisorQuery = new FetchUserList({ advisor: _id })
		const fetchUserListHandler = new FetchUserListHandler()
		const clientsList = await fetchUserListHandler.handle(advisorQuery)

		const adviseeList = []
		for (let i = 0; i < clientsList.length; i++) {
			adviseeList.push(
				commonUtils.formatUserDetails(clientsList[i], "restricted")
			)
		}

		return res.status(200).send({ adviseeList })
	} catch (error) {
		next(new customError("Failed to fetch advisee list", 500, "error"))
	}
})

router.get("/assets/:userId", verifyUser, async (req, res, next) => {
	try {
		const { userId } = req.params

		const query = new FetchAssetList({ user: userId, sold: false })
		const fetchAssetListHandler = new FetchAssetListHandler()
		const assetsList = await fetchAssetListHandler.handle(query)

		return res.status(200).send({ assetsList })
	} catch (error) {
		next(
			new customError("Failed to fetch assets for the given user", 500, "error")
		)
	}
})

router.post("/sell/assets/:assetId", verifyUser, async (req, res, next) => {
	try {
		const { assetId } = req.params
		const advisor = req.body.user

		const deleteUserAsset = new DeleteUserAsset(assetId, advisor)
		const deleteUserAssetHandler = new DeleteUserAssetHandler()
		const updatedAsset = await deleteUserAssetHandler.handle(deleteUserAsset)

		res.status(200).json(updatedAsset)
	} catch (error) {
		next(
			new customError("Failed to sell assets of the given user", 500, "error")
		)
	}
})

router.post(
	"/buy/:userId/assets",
	verifyUser,
	[
		// check not exist here only TODO
		body("quantity").isInt().withMessage("Quantity must be a whole number"),
		body("datePurchased")
			.custom((value) => {
				// Check if the date has the format "yyyy-mm-dd"
				//const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
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

			const { ...assetData } = req.body

			const { userId } = req.params
			const fetchUser = new FetchUser({ _id: userId })
			const fetchUserHandler = new FetchUserHandler()
			const user = await fetchUserHandler.handle(fetchUser)

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

module.exports = router
