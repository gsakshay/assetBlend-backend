const path = require("path")


const env = process.env.NODE_ENV || 'development';



require("dotenv").config({
    path: path.resolve(`.env.${env}`)
})

console.log("Loading constants...")

const roles = {
    CILENT:"CLIENT",
    ADVISOR:"ADVISOR",
    ADMIN:"ADMIN",
    DEFAULT:"CLIENT"
}

dow_30_stocks = ["AXP", "AMGN", "AAPL", "BA", "CAT", "CSCO", "CVX", "GS", "HD", "HON", "IBM", "INTC", "JNJ", "KO", "JPM", "MCD", "MMM", "MRK", "MSFT", "NKE", "PG", "TRV", "UNH", "CRM", "VZ", "V", "WBA", "WMT", "DIS", "DOW"]
preLoadedCrypto = ['lrceth', 'alcxbtc', 'ryodoge']
const constants = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TIINGO_BASE_URL: process.env.TIINGO_BASE_URL,
    API_TOKEN: process.env.API_TOKEN,
    ROLES:roles,
    preLoadStocks:dow_30_stocks,
    preLoadedCrypto:preLoadedCrypto
}

module.exports = constants