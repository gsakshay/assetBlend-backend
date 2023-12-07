const customError = require("../../utils/errors/customError");
const { generateResetToken } = require("../../utils/helpers/authHelpers/generateTokens");
const UpdateUserCommand = require("../commands/updateUserCommand");
const FetchUserByUsernameQuery = require("../queries/FetchUserByUsernameQuery");
const FetchUserByUsernameQueryHandler = require("../queryHandlers/fetchUserByUsernameHandler");
const UpdateUserHandler = require("./updateUserHandler");

class RequestPasswordResetHandler {
    async handle(command){

        try{
            const username = command.username

            // missing input
            if(!username){
                throw new customError("Missing requires parameter. Expected username", 400, 'warn')
            }
            // get user
            let user = undefined;
            const fetchByUsernameQuery = new FetchUserByUsernameQuery(username);
            const fetchByUsernameQueryHandler = new FetchUserByUsernameQueryHandler()
            user = await fetchByUsernameQueryHandler.handle(fetchByUsernameQuery);
            console.log(user)
            // no user with this username
            if(!user){
                throw new customError("User not found", 404, 'warn');
            }
            // generate resetToken
            const resetToken = generateResetToken(user)
            // update user with resetToken  
            user.resetToken = resetToken
            const updateUserCommand = new UpdateUserCommand(user)
            const updateUserHandler = new UpdateUserHandler()
            await updateUserHandler.handle(updateUserCommand)

            // return token
            return {
                resetToken : user.resetToken
            }
        }catch(error){
            console.log(error)
            throw error
        }
        

    }
}

module.exports = RequestPasswordResetHandler