const customError = require("../../utils/errors/customError")
const UpdateUserCommand = require("../commands/users/updateUserCommand")
const UpdateUserHandler = require("./users/updateUserHandler")

class DeleteAdvisorHandler{
    async handle(command){
        try{
            const user = command.user
            const advisor = user.advisor
            if(advisor === null){
                return user
            }
            const updateUserHandler = new UpdateUserHandler()
            // update user
            user.advisor = null
            const updateUser = new UpdateUserCommand(user)
            await updateUserHandler.handle(updateUser)

            // update advisor
            advisor.totalInvestedAmount = advisor.totalInvestedAmount - user.totalInvestedAmount
            try{
                const updateAdvisor = new UpdateUserCommand(advisor)
                await updateUserHandler.handle(updateAdvisor)
                return user
            }catch(err){
                throw new customError("Failed to update advisor", 500, 'error')
            }
            
            
        }catch(error){
            if(error.message === "Failed to update advisor"){
                // reset advisor back to user
                advisor.totalInvestedAmount = advisor.totalInvestedAmount + user.totalInvestedAmount
                user.advisor = advisor
                const resetUser = new UpdateUserCommand(user)
                const handleResetuser = new UpdateUserHandler()
                await handleResetuser.handle(resetUser)
                throw new customError("Failed to remove advisor", 500, 'error')
            }else{
                throw error
            }
            
        }
    }
}

module.exports = DeleteAdvisorHandler