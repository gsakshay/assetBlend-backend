const { verifyRefreshToken } = require("../../utils/helpers/authHelpers/verifyRefreshToken");
const FetchUserByUsernameQuery = require("../queries/FetchUserByUsernameQuery");
const FetchUserByUsernameQueryHandler = require("../queryHandlers/fetchUserByUsernameHandler");
const UpdateUserCommand = require('../commands/updateUserCommand')
const UpdateUserHandler = require('../commandHandlers/updateUserHandler')

class LogoutHandler {
    async handle(command){
        try {
            // and header
            const cookie = command.cookieData
            console.log(cookie)
            // no refreshToken in cookie (already removed)
            if (!cookie?.jwt) {
                return { status: 200 }
            }

            const refreshToken = cookie.jwt
            // decode refreshToken 
            const decoded = await verifyRefreshToken(refreshToken)
            //if invalid token or expired (consider logged out) 
            if (!decoded) {
                return { status: 200 }
            }
            // get user
            const fetchByUsernameQuery = new FetchUserByUsernameQuery(decoded)
            const fetchByUsernameQueryHandler = new FetchUserByUsernameQueryHandler()
            const user = await fetchByUsernameQueryHandler.handle(fetchByUsernameQuery)
            console.log(user)
            // remove refreshToken & update user
            if (user) {
                user.refreshToken = ""
                const updateUserCommand = new UpdateUserCommand(user)
                const updateUserHandler = new UpdateUserHandler()
                await updateUserHandler.handle(updateUserCommand)

            }
            // return
            return { status: 200}

        }catch(error){
            console.log(error)
            throw error
        }
            
    }
}

module.exports = LogoutHandler