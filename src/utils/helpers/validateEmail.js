const validator = require("validator")

exports.validateEmail = function (email) {
    if(validator.isEmail(email)){
        return true;
    }else{
        return false;
    }
}