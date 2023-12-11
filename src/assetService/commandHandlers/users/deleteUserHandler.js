const customError = require("../../../utils/errors/customError");
const UserService = require("../../models/users/users.model");

class DeleteUserHandler {
  async handle(command) {
    try {
      const _id = command.userId;
      const result = await UserService.deleteUser(_id);
      return result;
    } catch (error) {
      throw new customError(
        `Error in deleting user for given criteria ${query.criteria}`,
        400,
        "error"
      );
    }
  }
}

module.exports = DeleteUserHandler;
