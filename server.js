/** @format */

// Importing necessary modules
const http = require("http")
const mongoose = require("mongoose")
require("dotenv").config()

// Importing the Express app
const app = require("./src/app")

// Importing necessary functions from models
// TODO

// Setting up environment variables
const constants = require('./src/utils/constants/index')
// const PORT = process.env.PORT
// const MONGO_URL = process.env.MONGO_URL



console.log(constants.PORT, constants.MONGO_URL)

// Creating an HTTP server using Express app
const server = http.createServer(app)

// Establishing MongoDB connection
mongoose.connection.once("open", () => {
	console.log("MongoDB connection successful")
})
mongoose.connection.on("error", (err) => console.error(err))

// Starting the server after database setup
async function startServer() {
	// Connecting to MongoDB
	await mongoose.connect(constants.MONGO_URL)

	// TODO - Any business logic - Getting the dependencies ready

	server.listen(constants.PORT, () => console.log(`Server is listening on ${constants.PORT}`))
}

// Calling the startServer function to begin the server setup
startServer()
