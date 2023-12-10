const customError = require("../../utils/errors/customError")
const UpdateUserCommand = require("../commands/users/updateUserCommand")
const FetchUser = require("../queries/users/fetchUser")
const FetchUserHandler = require("../queryHandlers/users/fetchUserHandler")
const UpdateUserHandler = require("./users/updateUserHandler")

class AddAdvisorHandler {
    async handle(command){
        const updateUserhandler = new UpdateUserHandler()
        let user = {}
        try{
            user = command.user
            const advisorId = command.advisorId
            // if advisor ID missing
            if(!advisorId){
                throw customError("Must provide advisor ID", 400, 'warn')
            }
            const fetchUserHandler = new FetchUserHandler()
            // check advisor ID is valid
            const fetchUser = new FetchUser({_id:advisorId})
            const advisorData = await fetchUserHandler.handle(fetchUser)
            if(!advisorData) {
                throw new customError("Invalid advisor ID", 400, 'warn')
            }

            // advisor id is valid. set to user
            user.advisor = advisorData
            const updateUser = new UpdateUserCommand(user)
            await updateUserhandler.handle(updateUser)

            // udpate advisor total investment and update advisor data
            // advisor data updated only if user has assets
            if(user.totalInvestedAmount > 0){
                advisorData.totalInvestedAmount = advisorData.totalInvestedAmount + user.totalInvestedAmount
            
                try{
                    const updateAdvisor = new UpdateUserCommand(advisorData)
                    await updateUserhandler.handle(updateAdvisor)
                }catch(err){
                    throw new customError("Failed to update advisor data", 500, 'error')
                }
            }
            
            // updated successfully
            return user

        }catch(error){
            if(error.message === "Failed to update advisor data"){
                // udapte user advisor to null
                user.advisor = null
                const resetUser = new UpdateUserCommand(user)
                await updateUserhandler.handle(resetUser)
                throw new customError("Failed to add advisor", 500, 'error')
            }else{
                throw error
            }
            
        }
    }
}


module.exports = AddAdvisorHandler