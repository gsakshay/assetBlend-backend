/** @format */

// Importing necessary modules
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

// Importing defined routes
// TODO

// Creating an Express app
const app = express()

// Middleware setup
app.use(cors()) // Handling Cross-Origin Resource Sharing (CORS)
app.use(morgan("combined")) // Logging HTTP requests
app.use(express.json()) // Parsing JSON data

// API and redirect routes setup
app.use("/", (req, res, next) => res.send("Welcome to Financial Portfolio")) // Redirect routes

// Handling undefined routes with a custom error
app.all("*", (req, res, next) => {
	next(new customError("404 Route Not Found", 404, "warn"))
})

// Error handling middleware
app.use((err, req, res, next) => {
	// Setting locals for error details
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// Rendering the error page
	res.status(err.status || 500)
	res.render("error")
})

// Exporting the configured Express app
module.exports = app
