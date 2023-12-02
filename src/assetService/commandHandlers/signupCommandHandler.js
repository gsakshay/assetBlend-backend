const customError = require('../../utils/errors/customError');
const FetchRoleId = require('../queries/fetchRoleId');
const FetchRoleIdHandler = require('../queryHandlers/fetchRoleIdHandler');
const {getAuthTokens} = require('../../utils/helpers/authHelpers/getTokens')
const {hashPassword} = require('../../utils/helpers/hash')
const CreateUserCommand = require('../commands/createUserCommand');
const CreateUserHandler = require('./createUserHandler');

class SignupCommandHandler {
    async handle(command, req, res, next) {
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
            try{
                const createUserCommand = new CreateUserCommand(payload)
                const createUserHandler = new CreateUserHandler();
                const user = await createUserHandler.handle(createUserCommand)
            }catch(error){
                res.clearCookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                throw new customError("Internal server error", 500, 'error')
            }
            
            //set cookie
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
            //return response
            return {
                username: user.username,
                accessToken: accessToken
            }
        }catch(error){
            //delete user?
            res.clearCookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            throw new customError("Internal server error", 500, 'error')
        }
            
    }
}

module.exports = SignupCommandHandler;