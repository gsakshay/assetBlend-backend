/** @format */
const Roles = require('./roles.mongo');
const customError = require('../../../utils/errors/customError')


// insert roles
async function loadRoles(roleList){
    try{    
        const res = await Roles.create(roleList)
    }catch(error){
        if (error.code === 11000 || error.code === 11001) {
            throw new customError("Initial data of roles already loaded. Skipping insertion.",409, 'warn');
          } else {
            throw new customError('Failed to load initial roles data', 500, 'error')
        }
        
    }
}

// get a role based on criteria
async function getRole(criteria){
    try{
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Atleast one criteria must be provided to fetch single entry.', 400, 'warn');
        }else{
            const role = await Roles.findOne(criteria);
            return role;
        }
    }catch(error){
        if(error.status===400){
            throw error
        }else{
            throw new customError(`Error fetching role: ${error.message}`, 500, 'error');
        }
    }
}

// get roles based on criteria
async function getRoles(criteria={}) {
    try{
        const roles = await Roles.find(criteria);
        return roles;
    }catch (error) {
        console.log(error)
        throw new customError(`Error fetching role: ${error.message}`, 500, 'error');
      }
}

module.exports = { 
    getRole, 
    getRoles,
    loadRoles
};