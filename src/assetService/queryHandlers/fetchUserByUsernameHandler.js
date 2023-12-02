const customError = require('../../utils/errors/customError')
const UserService = require('../models/users/users.model');

class FetchUserByUsernameQueryHandler {
  async handle(query) {
    try {
      const user = await UserService.getUserByUsername(query.username)
      return user;
    } catch (error) {
        throw new customError(`No user found with username ${query.username}`, 400, 'warn');
    }
  }
}

module.exports = FetchUserByUsernameQueryHandler;