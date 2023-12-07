/** @format */
const Users = require('./users.mongo');
const customError = require('../../../utils/errors/customError')

async function getUserByUsername(username) {
  try {
    let user = undefined;
    user = await Users.findOne({ username });
    return user;
  } catch (error) {
    throw new customError((`Error fetching user: ${error.message}`, 500, 'error'));
  }
}

async function createUser(userPayload) {
    try{
        const user = await Users.create({...userPayload})
        return user
    }catch(error){
        console.log(error)
        if (error.code === 11000 && error.keyPattern) {
            // Duplicate key error for the field
            const duplicateKey = Object.keys(error.keyValue)[0]
            throw new customError(`Validation failed : ${duplicateKey} already in use`, 400, 'warn')
          }else{
            throw new customError(("Failed to add user to DB", 500,'error'))
          } 
        
    }
}

async function updateUser(user) {
    try{
        await Users.findOneAndUpdate({username:user.username}, user)
    }catch(error){
        throw new customError("Internal server error", 500, 'error')
    }
}

module.exports = { getUserByUsername, createUser, updateUser };


