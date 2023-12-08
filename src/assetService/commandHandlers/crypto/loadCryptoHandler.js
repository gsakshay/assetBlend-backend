const cryptoService = require('../../models/cryptoStocks/cryptoStocks.model')

class LoadCryptoHandler {
    async handle(command){
        try{
            await cryptoService.loadCrypto(command.cryptoList)
            return
        }catch(error){
            throw error
        }
    }
}

module.exports=LoadCryptoHandler