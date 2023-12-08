const cryptoService = require('../../models/cryptoStocks/cryptoStocks.model')
class UpdateOneCryptoHandler{
    async handle(command){
        try{
            const crypto = command.crypto
            await cryptoService.updateCrypto(crypto)
        }catch(error){
            throw error
        }
    }
}

module.exports = UpdateOneCryptoHandler