const customError = require('../../utils/errors/customError')
const {verifyRefreshToken} = require('../../utils/helpers/authHelpers/verifyRefreshToken')
const FetchUserByUsernameQuery = require('../queries/FetchUserByUsernameQuery')
const FetchUserByUsernameQueryHandler = require('../queryHandlers/fetchUserByUsernameHandler')
const UpdateUserCommand = require('../commands/updateUserCommand')
const UpdateUserHandler = require('../commandHandlers/updateUserHandler')
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
            const decoded = await verifyRefreshToken(oldRefreshToken)
            if(decoded === false){
                throw new customError("Invalid Token", 401, 'warn')
            }
            // match token with user
            let user = undefined;
            const fetchByUsernameQuery = new FetchUserByUsernameQuery(decoded);
            const fetchByUsernameQueryHandler = new FetchUserByUsernameQueryHandler()
            user = await fetchByUsernameQueryHandler.handle(fetchByUsernameQuery);

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