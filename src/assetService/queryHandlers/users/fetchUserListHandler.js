const customError = require('../../../utils/errors/customError')
const UserService = require('../../models/users/users.model');

class FetchUserListHandler {
  async handle(query) {
    try {
      const userList = await UserService.getUsers(query.criteria)
      return userList;
    } catch (error) {
        throw new customError(`No users found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchUserListHandler;