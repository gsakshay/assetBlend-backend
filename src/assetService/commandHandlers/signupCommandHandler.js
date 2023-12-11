const customError = require('../../utils/errors/customError');
const {getAuthTokens} = require('../../utils/helpers/authHelpers/getTokens')
const {hashPassword} = require('../../utils/helpers/hash')
const CreateUserCommand = require('../commands/users/createUserCommand');
const CreateUserHandler = require('./users/createUserHandler');

class SignupCommandHandler {
    async handle(command) {
        try{
            const payload = command.payload;

            // get authtokens
            const {accessToken, refreshToken} = getAuthTokens(payload)
            payload.refreshToken = refreshToken

            // hash pswd
            const hashedPassword = await hashPassword(payload.password);
            payload.password = hashedPassword
            
            //create user
            let user = undefined
            try{
                //payload.role = payload.role._id
                const createUserCommand = new CreateUserCommand(payload)
                const createUserHandler = new CreateUserHandler();
                user = await createUserHandler.handle(createUserCommand)
            }catch(error){
                throw error
            }
            //return response
            const responseData = {
                username: user.username,
                role: user.role.roleName,
                accessToken: accessToken,
                refreshToken : refreshToken
            }
            return responseData
        }catch(error){
            throw error
        }
            
    }
}

module.exports = SignupCommandHandler;