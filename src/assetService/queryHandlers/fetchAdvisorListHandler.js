const customError = require("../../utils/errors/customError")
const FetchRole = require("../queries/roles/fetchRole")
const FetchUserList = require("../queries/users/fetchUserList")
const FetchRoleHandler = require("./roles/fetchRoleHandler")
const FetchUserListHandler = require("./users/fetchUserListHandler")

class FetchUserByRoleHandler {
    async handle(query){
        try{
            const roleName = query.roleName

            if(!roleName){
                throw new customError("Must provide a role name", 400, 'warn')
            }

            // get roleId 
            const fetchRole = new FetchRole({roleName: roleName})
            const fetchRoleHandler = new FetchRoleHandler()
            const roleData = await fetchRoleHandler.handle(fetchRole)

            let userListByRole =[]
            const fetchUserList = new FetchUserList({role: roleData._id, approved:true})
            const fetchUserListHandler = new FetchUserListHandler()
            userListByRole = await fetchUserListHandler.handle(fetchUserList)

            return userListByRole

            
        }catch(error){
            throw error
        }
        


    }
}

module.exports = FetchUserByRoleHandler