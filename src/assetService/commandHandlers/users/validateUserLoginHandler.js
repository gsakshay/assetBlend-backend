const { comparePassword } = require("../../../utils/helpers/hash");
const FetchUser = require("../../queries/users/fetchUser")
const FetchUserHandler = require("../../queryHandlers/users/fetchUserHandler")

class ValidateUserLoginHandler {
    async handle(command){
        try{
            const payload = command.payload
            // query user with username
            const fetchUser = new FetchUser({username:payload.username})
            const fetchUserHandler = new FetchUserHandler();
            const user = await fetchUserHandler.handle(fetchUser)
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