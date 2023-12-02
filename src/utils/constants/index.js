const path = require("path")


const env = process.env.NODE_ENV || 'development';



require("dotenv").config({
    path: path.resolve(`.env.${env}`)
})

console.log("Loading constants...")

const constants = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = constants