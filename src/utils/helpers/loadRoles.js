const LoadRolesHandler = require("../../assetService/commandHandlers/loadRolesHandler")
const LoadRoles = require("../../assetService/commands/loadRoles")

module.exports = async function loadRoles(){
    try{
        const roleList = [
            {roleName: "CLIENT"},
            {roleName: "ADVISOR"},
            {roleName: "ADMIN"}
        ]
        const loadRoles = new LoadRoles(roleList)
        const loadRolesHandler = new LoadRolesHandler()
        await loadRolesHandler.handle(loadRoles)
    }catch(error){
        throw error
    }
    

}