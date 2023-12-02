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
        throw new customError(("Failed to add user to DB", 500,'error'))
    }
}

module.exports = { getUserByUsername, createUser };


