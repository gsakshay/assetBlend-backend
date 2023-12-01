/** @format */
const mongoose = require("mongoose")

const User = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		address: {
			type: String,
		},
		role: {},
		advisor: {},
		approved: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("User", User)
