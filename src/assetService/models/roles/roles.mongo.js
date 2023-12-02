/** @format */
const mongoose = require("mongoose")

const Roles = new mongoose.Schema(
	{
		roleName: {
			type: String,
			required: true,
			unique: true,
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Roles", Roles)
