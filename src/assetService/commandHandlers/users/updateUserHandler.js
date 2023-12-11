const UserService = require('../../models/users/users.model');

class UpdateUserHandler {
    async handle(command) {
        try{
            const userData = command.userData
            await UserService.updateUser(userData)
        }catch(error){
            throw error
        }
    }
}

module.exports = UpdateUserHandler