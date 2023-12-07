const customError = require('../../utils/errors/customError');
const FetchRoleId = require('../queries/fetchRoleId');
const FetchRoleIdHandler = require('../queryHandlers/fetchRoleIdHandler');
const {getAuthTokens} = require('../../utils/helpers/authHelpers/getTokens')
const {hashPassword} = require('../../utils/helpers/hash')
const CreateUserCommand = require('../commands/createUserCommand');
const CreateUserHandler = require('./createUserHandler');

class SignupCommandHandler {
    async handle(command) {
        try{
            const payload = command.payload;
            // get role id
            const fetchRoleQuery = new FetchRoleId(payload.role)
            const fetchRoleIdHandler = new FetchRoleIdHandler();
            const role = await fetchRoleIdHandler.handle(fetchRoleQuery);

            // update role to ID
            payload.role = role

            // get authtokens
            const {accessToken, refreshToken} = getAuthTokens(payload)
            payload.refreshToken = refreshToken

            // hash pswd
            const hashedPassword = await hashPassword(payload.password);
            payload.password = hashedPassword
            
            //create user
            let user = undefined
            try{
                const createUserCommand = new CreateUserCommand(payload)
                const createUserHandler = new CreateUserHandler();
                user = await createUserHandler.handle(createUserCommand)
            }catch(error){
                throw error
            }

            //return response
            const responseData = {
                username: user.username,
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