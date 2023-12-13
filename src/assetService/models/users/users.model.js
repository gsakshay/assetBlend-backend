/** @format */
const Users = require('./users.mongo');
const customError = require('../../../utils/errors/customError')



// get multiple users based on criteria or all
async function getUsers(criteria={}){
    try{
        userList = await Users.find(criteria).populate('role');
        return userList
    } catch (error) {
        console.log(error)
    throw new customError(`Error fetching user: ${error.message}`, 500, 'error');
  }
}


// get a single user based on  a criteria
async function getUser(criteria){
    try{
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Atleast one criteria must be provided to fetch single entry.', 400, 'warn');
        }else{
            const user = await Users.findOne(criteria).populate('role').populate('advisor');
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
        // update similar if needed in other updates
        //const updateduser = await Users.findOneAndUpdate({username:user.username}, { $set: { totalInvestedAmount: user.totalInvestedAmount } }, { new: true })
        const nonUpdateableFields = ['createdAt', 'updatedAt', '__v', '_id'];

        // Remove non-updateable fields if they are present
        const updatedUserObject = {};

        Object.keys(user).forEach(key => {
        if (!nonUpdateableFields.includes(key)) {
            updatedUserObject[key] = user[key];
        }
        });
        const updateduser = await Users.findOneAndUpdate({username:user.username}, {$set : updatedUserObject}, { new: true })
    }catch(error){
        console.log(error)
        throw new customError("Internal server error", 500, 'error')
    }
}

// get count of users based on role
async function getUsersCount(criteria){
    try {
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Criteria must be provided to fetch count.', 400, 'warn');
        }else{
            const count = await Users.countDocuments(criteria);
            return count;
        }
    } catch (error) {
        throw new customError(`Error fetching count of documents for given criteria: ${error.message}`, 500, 'error');
    }
}

// delete user based on _id
async function deleteUser(criteria){
    try {
        if (!criteria || Object.keys(criteria).length === 0) {
            throw new customError('Criteria must be provided to delete an user.', 400, 'warn');
        }else{
            const result = await Users.deleteOne(criteria);
            return result;
        }
    } catch (error) {
        throw new customError(`Error deleting user for given criteria: ${error.message}`, 500, 'error');
    }
}

module.exports = { 
    createUser, 
    updateUser,
    getUsers,
    getUser,
    getUsersCount,
    deleteUser
};


