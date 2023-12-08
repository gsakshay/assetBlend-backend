/** @format */
const Roles = require('./roles.mongo');
const customError = require('../../../utils/errors/customError')


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
        throw new customError(`Error fetching role: ${error.message}`, 500, 'error');
      }
}

module.exports = { 
    getRole, 
    getRoles 
};