const customError = require("../../utils/errors/customError");
const { generateResetToken } = require("../../utils/helpers/authHelpers/generateTokens");
const UpdateUserCommand = require("../commands/users/updateUserCommand");
const FetchUser = require("../queries/users/fetchUser");
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler");
const UpdateUserHandler = require("./users/updateUserHandler");

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
            const fetchUser = new FetchUser({username: username});
            const fetchUserHandler = new FetchUserHandler()
            user = await fetchUserHandler.handle(fetchUser);
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