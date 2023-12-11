const customError = require('../utils/errors/customError')
const constants = require('../utils/constants/index')
exports.hasUserRole = async function (req,res,next) {
    try {
        // get from req vody or from req body user
        const payload = req.body.user
        const role = payload.role
        if (role.roleName !== constants.ROLES.CILENT) {
            next(new customError("Permission Denied", 400, 'warn'));
        }
        next()
    } catch (error) {
        next(new customError("Failed to check if user has role USER", 500, 'error'))
    }

}