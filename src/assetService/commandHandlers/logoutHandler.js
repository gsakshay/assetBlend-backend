const { verifyToken } = require("../../utils/helpers/authHelpers/verifyToken");
const FetchUser = require("../queries/users/fetchUser");
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler");
const UpdateUserCommand = require('../commands/users/updateUserCommand')
const UpdateUserHandler = require('./users/updateUserHandler')

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
            const decoded = await verifyToken(refreshToken)
            //if invalid token or expired (consider logged out) 
            if (!decoded) {
                return { status: 200 }
            }
            // get user
            const fetchUser = new FetchUser({username:decoded})
            const fetchUserHandler = new FetchUserHandler()
            const user = await fetchUserHandler.handle(fetchUser)
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
            throw error
        }
            
    }
}

module.exports = LogoutHandler