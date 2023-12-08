const customError = require('../utils/errors/customError')

exports.isNotAdminUser = async function (req,res,next) {
    try {
        // get from req vody or from req body user
        const payload = req.body.user || req.body
        const role = payload.role
        if (role.roleName === 'ADMIN') {
            next(new customError("Permission Denied", 400, 'warn'));
        }
        next()
    } catch (error) {
        next(new customError("Failed to check if user is Admin", 500, 'error'))
    }

}