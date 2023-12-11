const customError = require('../../../utils/errors/customError')
const RoleServices = require('../../models/roles/roles.model');

class FetchRoleListHandler {
  async handle(query) {
    try {
      const roleList = await RoleServices.getRoles(query.criteria)
      return roleList;
    } catch (error) {
        throw new customError(`No roles found with criteria ${query.criteria}`, 400, 'warn');
    }
  }
}

module.exports = FetchRoleListHandler;