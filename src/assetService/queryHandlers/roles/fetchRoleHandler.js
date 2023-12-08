const customError = require('../../../utils/errors/customError')
const RoleServices = require('../../models/roles/roles.model');

class FetchRoleHandler {
  async handle(query) {
    try {
      const role = await RoleServices.getRole(query.criteria)
      return role;
    } catch (error) {
        throw new customError(`No role found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchRoleHandler;