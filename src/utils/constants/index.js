/** @format */

const path = require("path")

const env = process.env.NODE_ENV || "development"

require("dotenv").config({
	path: path.resolve(`.env.${env}`),
})

console.log("Loading constants...")

const roles = {
	CILENT: "CLIENT",
	ADVISOR: "ADVISOR",
	ADMIN: "ADMIN",
	DEFAULT: "CLIENT",
}

const constants = {
	PORT: process.env.PORT,
	MONGO_URL: process.env.MONGO_URL,
	JWT_SECRET: process.env.JWT_SECRET,
	TIINGO_BASE_URL: process.env.TIINGO_BASE_URL,
	API_TOKEN: process.env.API_TOKEN,
	ROLES: roles,
}

module.exports = constants
