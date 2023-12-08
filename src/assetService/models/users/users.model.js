/** @format */
const Users = require('./users.mongo');
const customError = require('../../../utils/errors/customError')



// get multiple users based on criteria or all
async function getUsers(criteria={}){
    try{

        userList = await Users.find(criteria).populate('role');
        return userList
    } catch (error) {
    throw new customError(`Error fetching user: ${error.message}`, 500, 'error');
  }
}


// get a single user based on  a criteria
async function getUser(criteria){
    try{
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Atleast one criteria must be provided to fetch single entry.', 400, 'warn');
        }else{
            const user = await Users.findOne(criteria).populate('role');
            return user;
        }
    }catch(error){
        console.log(error)
        if(error.status===400){
            throw error
        }else{
            throw new customError(`Error fetching user: ${error.message}`, 500, 'error');
        }
    }
}

// add new user
async function createUser(userPayload) {
    try{
        const user = await Users.create({...userPayload})
        return user
    }catch(error){
        if (error.code === 11000 && error.keyPattern) {
            // Duplicate key error for the field
            const duplicateKey = Object.keys(error.keyValue)[0]
            throw new customError(`Validation failed : ${duplicateKey} already in use`, 400, 'warn')
          }else{
            throw new customError("Failed to add user to DB", 500,'error')
          } 
        
    }
}

// update user
async function updateUser(user) {
    try{
        await Users.findOneAndUpdate({username:user.username}, user)
    }catch(error){
        throw new customError("Internal server error", 500, 'error')
    }
}

module.exports = { 
    createUser, 
    updateUser,
    getUsers,
    getUser };


