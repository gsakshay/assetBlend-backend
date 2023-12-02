/** @format */
const Roles = require('./roles.mongo');
const customError = require('../../../utils/errors/customError')


async function getRoleID(roleName) {
  try {
    const role = await Roles.findOne({ roleName:roleName });
    return role;
  } catch (error) {
    throw new customError((`Error fetching role: ${error.message}`, 500, 'error'));
  }
}

module.exports = { getRoleID };