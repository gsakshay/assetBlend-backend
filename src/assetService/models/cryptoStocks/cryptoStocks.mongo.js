/** @format */
const mongoose = require("mongoose")

const CryptoSchema = new mongoose.Schema(
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
        baseCurrency: {
            type: String,
            deafult:''
        },
        quoteCurrency: {
            type: String,
            deafult:''
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

module.exports = mongoose.model("CryptoStocks", CryptoSchema)
