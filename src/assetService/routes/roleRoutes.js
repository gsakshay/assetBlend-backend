const express = require('express');
const FetchRoleList = require('../queries/roles/fetchRoleList');
const FetchRoleListHandler = require('../queryHandlers/roles/fetchRoleListHandler');
const customError = require('../../utils/errors/customError');
const FetchRole = require('../queries/roles/fetchRole');
const FetchRoleHandler = require('../queryHandlers/roles/fetchRoleHandler');
const router = express.Router();
const constants = require('../../utils/constants/index')

router.get("/", async (req, res, next)=> {
    try{
        const fetchRoles = new FetchRoleList()
        const fetRolesHandler = new FetchRoleListHandler()
        const roleList = await fetRolesHandler.handle(fetchRoles)
        res.status(200).json(roleList)
    }catch(error){
        next(new customError("Failed to fetch all roles", 500, 'error'))
    }
    
})

router.get('/permitted', async(req,res,next)=> {
    try{
        const nonPermittedRole = constants.ROLES.ADMIN
        // fetchrole id of admin
        const fetchRoles = new FetchRoleList({ roleName: { $ne: nonPermittedRole} })
        const fetchRolesHandler = new FetchRoleListHandler()
        const roleList = await fetchRolesHandler.handle(fetchRoles)
        res.status(200).json(roleList)
    }catch(err){
        console.log(err)
        next(new customError(" Failed to fetch permitted roles", 400, 'warn'))
    }
})

router.get("/:roleID", async (req,res,next)=> {
    try{
        const roleID = req.params.roleID
        const fetchRole = new FetchRole({_id:roleID})
        const fetchRoleHandler = new FetchRoleHandler()
        try{
            const role = await fetchRoleHandler.handle(fetchRole)
            res.status(200).json(role)
        }catch(err){
            next(new customError(" Please provide a valid role id", 400, 'warn'))
        }
        
    }catch(error){
        next(new customError("Failed to fetch given role", 500, 'error'))
    }
})



module.exports = router