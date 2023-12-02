const customError = require('../../utils/errors/customError')
const RoleServices = require('../models/roles/roles.model');

class FetchRoleIdHandler {
  async handle(query) {
    try {
      const role = await RoleServices.getRoleID(query.role)
      return role;
    } catch (error) {
        throw new customError(`No user found with username ${query.role}`, 400, 'warn');
    }
  }
}

module.exports = FetchRoleIdHandler;