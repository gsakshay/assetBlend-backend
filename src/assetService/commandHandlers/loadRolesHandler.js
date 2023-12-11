const RoleServices = require('../models/roles/roles.model')
class LoadRolesHandler {
    async handle(command){
        try{
            await RoleServices.loadRoles(command.roleList)
            return
        }catch(error){
            throw error
        } 
    }
}

module.exports = LoadRolesHandler