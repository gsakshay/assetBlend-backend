const customError = require('../../../utils/errors/customError')
const UserService = require('../../models/users/users.model');

class FetchUserHandler {
  async handle(query) {
    try {
      const user = await UserService.getUser(query.criteria)
      return user;
    } catch (error) {
        throw new customError(`No user found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchUserHandler;