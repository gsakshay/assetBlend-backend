/** @format */
const mongoose = require("mongoose")

const StockSchema = new mongoose.Schema(
	{
		ticker: {
			type: String,
			required: true,
			unique: true,
		},
        name: {
            type: String,
            default:'',
        },
        isActive: {
            type: Boolean,
            deafult:false
        },
        isADR: {
            type: Boolean,
            deafult:false
        },
        reportingCurrency:{
            type: String,
            default: ''
        },
        isNews: {
            type: Boolean,
            default: false
        }
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Stocks", StockSchema)
