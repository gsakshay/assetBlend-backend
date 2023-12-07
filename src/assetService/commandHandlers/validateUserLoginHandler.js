const { comparePassword } = require("../../utils/helpers/hash");
const FetchUserByUsernameQuery = require("../queries/FetchUserByUsernameQuery")
const FetchUserByUsernameQueryHandler = require("../queryHandlers/fetchUserByUsernameHandler")

class ValidateUserLoginHandler {
    async handle(command){
        try{
            const payload = command.payload
            // query user with username
            const fetchUserByUsername = new FetchUserByUsernameQuery(payload.username)
            const fetchUserHandler = new FetchUserByUsernameQueryHandler();
            const user = await fetchUserHandler.handle(fetchUserByUsername)
            if(!user) return false

            // comapre hashed pswd
            const isPasswordMatch = await comparePassword(payload.password, user.password)
            if(!isPasswordMatch) return false
            // return false or user
            return user
        }catch(error){
            throw error
        }
    }
}

module.exports = ValidateUserLoginHandler