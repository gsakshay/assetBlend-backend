/** @format */
const mongoose = require("mongoose");

const Users = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password : {
			type:String,
			required:true,
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
			default:"",
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Roles',
			required: true,
		},
		advisor: {
			type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
			default:null
		},
		approved: {
			type: Boolean,
			default: false,
		},
		totalInvestedAmount: {
			type : Number,
			default: 0
		},
		resetToken: {
			type: String,
			default: "",
		},
		refreshToken : {    
			type: String,
			default: "",
		}
	},
	{
		timestamps: true,
	}
)


Users.pre('save', function (next) {
	if (this.totalInvestedAmount < 0) {
	  this.totalInvestedAmount = 0;
	}
	next();
  });

module.exports = mongoose.model("Users", Users);
