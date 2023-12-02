const customError = require('../utils/errors/customError')

exports.isAdminRegisterRequest = function (req,res,next) {
    const payload = req.body;
    let {role} = payload.role || "USER"
    if(!role){
        role = "USER" //default value
    }
    if(role === "ADMIN"){
        next(new customError("Cannot register as an admin", 400, 'warn'));
    }else{
        //update role if it was not given
        req.body.role = role
    }
    next()
}