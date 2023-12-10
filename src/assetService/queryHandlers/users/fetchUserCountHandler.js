const customError = require('../../../utils/errors/customError')
const UserService = require('../../models/users/users.model');

class FetchUserCountHandler {
  async handle(query) {
    try {
      const count = await UserService.getUsersCount(query.criteria)
      return count;
    } catch (error) {
        throw new customError(`Error fetching count of documents for given criteria: ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchUserCountHandler;