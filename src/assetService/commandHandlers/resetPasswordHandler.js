const customError = require("../../utils/errors/customError")
const { verifyToken } = require("../../utils/helpers/authHelpers/verifyToken")
const UpdateUserCommand = require('../commands/users/updateUserCommand')
const UpdateUserHandler = require('./users/updateUserHandler')
const { hashPassword } = require("../../utils/helpers/hash")
const FetchUser = require("../queries/users/fetchUser")
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler")
const { validatePassword } = require("../../utils/helpers/validatePassword")

class ResetPasswordHandler {
    async handle(command){
        try{
            // incomplete input
            const resetToken = command.resetToken
            const username = command.username
            const password = command.password
            if(!resetToken || !username || !password){
                throw new customError("Missing required parameter. Expected resetToken, username and password", 400, 'warn')
            }
            //decode resetToken
            const decoded = await verifyToken(resetToken)
            if(decoded === false){
                throw new customError("Invalid username", 400, 'warn')
            }
            // if decoded username != input
            if(decoded !== username){
                throw new customError("Input data mismatch", 400, 'warn')
            }

            // validate new password 
            const isValidPassword = validatePassword(password);
            if(!isValidPassword.valid) {
                throw new customError(isValidPassword.message, 400, 'warn');
            }

            // if valid get user
            let user = undefined;
            const fetchUser = new FetchUser({username:decoded});
            const fetchUserHandler = new FetchUserHandler()
            user = await fetchUserHandler.handle(fetchUser);
            if(!user){
                throw new customError("User not found", 404, 'warn');
            }
            
            // hash pswd and remove resetToken
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword
            user.resetToken = ""

            // update user
            const updateUserCommand = new UpdateUserCommand(user)
            const updateUserHandler = new UpdateUserHandler()
            await updateUserHandler.handle(updateUserCommand)
            
            // return
            return {
                "message": "password reset successfully!"
            }
        }catch(error){
            console.log(error)
            throw error
        }
        

    }
}

module.exports=ResetPasswordHandler