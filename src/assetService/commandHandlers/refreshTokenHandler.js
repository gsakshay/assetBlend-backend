const customError = require('../../utils/errors/customError')
const {verifyToken} = require('../../utils/helpers/authHelpers/verifyToken')
const FetchUser = require('../queries/users/fetchUser')
const FetchUserHandler = require('../queryHandlers/users/fetchUserHandler')
const UpdateUserCommand = require('../commands/users/updateUserCommand')
const UpdateUserHandler = require('./users/updateUserHandler')
const { getAuthTokens } = require('../../utils/helpers/authHelpers/getTokens')

class RefreshTokenHandler{
    async handle(command){
        try{
            const cookies = command.cookieData
            if(!cookies?.jwt) {
                throw new customError("Refresh token missing", 400, 'warn')
            }
            const oldRefreshToken = cookies.jwt

            // verify token and decode
            const decoded = await verifyToken(oldRefreshToken)
            if(decoded === false){
                throw new customError("Invalid Token", 401, 'warn')
            }
            // match token with user
            let user = undefined;
            const fetchUser = new FetchUser({username:decoded});
            const fetchUserHandler = new FetchUserHandler()
            user = await fetchUserHandler.handle(fetchUser);

            if(!user){
                throw new customError("User not found", 404, 'warn');
            }
            // generate new tokens
            const {accessToken, refreshToken} = getAuthTokens(user)
            // set refreshToken
            user.refreshToken = refreshToken
            
            // update userData(refreshToken)
            const updateUserCommand = new UpdateUserCommand(user)
            const updateUserHandler = new UpdateUserHandler()
            await updateUserHandler.handle(updateUserCommand)
            // return response
            return {
                username : user.username,
                accessToken : accessToken,
                refreshToken: refreshToken
            }
        }catch(error){
            throw error;
        }
        
    }
}

module.exports = RefreshTokenHandler