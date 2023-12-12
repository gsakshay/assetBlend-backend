/** @format */

const express = require("express")
const router = express.Router()
const customError = require("../../utils/errors/customError")
const { verifyUser } = require("../../middlewares/verifyUser")
const { isAdminUser } = require("../../middlewares/isAdminUser")
const SetNewsCommand = require("../commands/setNewsCommand")
const SetNewsHandler = require("../commandHandlers/setNewsHandler")
const FetchUserCount = require("../queries/users/fetchUserCount")
const FetchUserCountHandler = require("../queryHandlers/users/fetchUserCountHandler")
const FetchRole = require("../queries/roles/fetchRole")
const FetchRoleHandler = require("../queryHandlers/roles/fetchRoleHandler")
const FetchCryptoCountHandler = require("../queryHandlers/crypto/fetchCryptoCountHandler")
const FetchStocksCountHandler = require("../queryHandlers/stocks/fetchStockCountHandler")
const FetchUserList = require("../queries/users/fetchUserList")
const FetchUserListHandler = require("../queryHandlers/users/fetchUserListHandler")
const commonUtils = require("../../utils/helpers/commonUtils")
const FetchUser = require("../queries/users/fetchUser")
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler")
const UpdateUserCommand = require("../commands/users/updateUserCommand")
const UpdateUserHandler = require("../commandHandlers/users/updateUserHandler")
const DeleteUserCommand = require("../commands/users/deleteUserCommand")
const DeleteUserHandler = require("../commandHandlers/users/deleteUserHandler")
const constants = require("../../utils/constants/index")

router.post("/news", verifyUser, isAdminUser, async (req, res, next) => {
	try {
		const setNewsCommand = new SetNewsCommand(req.body)
		const setNewshandler = new SetNewsHandler()
		const updateStatus = await setNewshandler.handle(setNewsCommand)
		let message = ""
		if (updateStatus.cryptoStatus === true) {
			message = message + "Requested crypto tickers updated."
		} else {
			message =
				message + "Some of the requested crypto tickers failed to update"
		}

		if (updateStatus.stockStatus === true) {
			message = message + "Requested stock tickers updated."
		} else {
			message = message + "Some of the requested stock tickers failed to update"
		}
		res.status(200).json({ updateStatus: updateStatus, message: message })
	} catch (error) {
		if (error instanceof customError) {
			next(error)
		} else {
			next(new customError("Internal server error", 500, "error"))
		}
	}
})

router.get("/dashboard", verifyUser, isAdminUser, async (req, res, next) => {
	try {
		//Fetch id against role
		const clientRole = new FetchRole({ roleName: "USER" })
		const advisorRole = new FetchRole({ roleName: "ADVISOR" })

		const fetchRoleHandler = new FetchRoleHandler()

		const clientRoleId = await fetchRoleHandler.handle(clientRole)
		const advisorRoleId = await fetchRoleHandler.handle(advisorRole)

		//Fetch count of users for role type
		const clients = new FetchUserCount({ role: clientRoleId })
		const advisors = new FetchUserCount({ role: advisorRoleId })

		const fetchUserCountHandler = new FetchUserCountHandler()

		const clientsCount = await fetchUserCountHandler.handle(clients)
		const advisorsCount = await fetchUserCountHandler.handle(advisors)

		const totalUsersCount = clientsCount + advisorsCount

		//Fetch count of crypto
		const fetchCryptoCountHandler = new FetchCryptoCountHandler()
		const cryptoCount = await fetchCryptoCountHandler.handle()

		//Fetch count of stocks
		const fetchStocksCountHandler = new FetchStocksCountHandler()
		const stocksCount = await fetchStocksCountHandler.handle()

		const totalAssetsCount = cryptoCount + stocksCount

		const dashboardData = {}
		dashboardData.totalUsersCount = totalUsersCount
		dashboardData.totalAssetsCount = totalAssetsCount

		res.status(200).send({ dashboardData })
	} catch (error) {
		next(
			new customError(
				"Error populating admin dashboard counts data",
				500,
				"error"
			)
		)
	}
})

router.get("/requests", verifyUser, isAdminUser, async (req, res, next) => {
	try {
		//Fetch role id for advisor
		const advisorRole = new FetchRole({ roleName: constants.ROLES.ADVISOR })
		const fetchRoleHandler = new FetchRoleHandler()
		const advisorRoleEntry = await fetchRoleHandler.handle(advisorRole)

		const { _id } = advisorRoleEntry

		//Fetch list of advisors
		const pendingRequests = new FetchUserList({ role: _id, approved: false })
		const fetchUserListHandler = new FetchUserListHandler()
		const advisorsList = await fetchUserListHandler.handle(pendingRequests)

		const requests = []

		for (let i = 0; i < advisorsList.length; i++) {
			const request = commonUtils.formatUserDetails(
				advisorsList[i],
				"restricted"
			)
			requests.push(request)
		}

		res.status(200).send({ requests })
	} catch (error) {
		next(new customError("Error fetching pending requests", 500, "error"))
	}
})

router.post(
	"/approve/:userId",
	verifyUser,
	isAdminUser,
	async (req, res, next) => {
		try {
			const { userId } = req.params

			const fetchUser = new FetchUser({ _id: userId })
			const fetchUserHandler = new FetchUserHandler()
			const userData = await fetchUserHandler.handle(fetchUser)

			const { username } = userData
			const user = {}
			user.username = username
			user.approved = true

			const updateUserCommand = new UpdateUserCommand(user)
			const updateUserHandler = new UpdateUserHandler()
			await updateUserHandler.handle(updateUserCommand)

			res.status(200).send({ message: "Advisor request approved successfully" })
		} catch (error) {
			next(new customError("Error in approving advisor request", 500, "error"))
		}
	}
)

router.delete(
	"/reject/:userId",
	verifyUser,
	isAdminUser,
	async (req, res, next) => {
		try {
			const { userId } = req.params
			const deleteUser = new DeleteUserCommand({ _id: userId })
			const deleteUserHandler = new DeleteUserHandler()
			const result = await deleteUserHandler.handle(deleteUser)

			if (result.deletedCount === 1) {
				console.log(`User with _id ${userId} deleted successfully`)
			} else {
				console.log(`User with _id ${userId} not found`)
			}

			res.status(200).send({ message: "Advisor request rejected successfully" })
		} catch (error) {
			next(new customError("Error in rejecting advisor request", 500, "error"))
		}
	}
)

module.exports = router
