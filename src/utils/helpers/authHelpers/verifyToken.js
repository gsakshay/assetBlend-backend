const constants = require('../../constants')
const jwt = require("jsonwebtoken");
const customError = require('../../errors/customError');

exports.verifyToken = async function(token){
    try{
        const decoded_data =  await new Promise((resolve, reject) => {
            jwt.verify(
                token, constants.JWT_SECRET,
                async (err, decoded) => {
                    if(err){
                        resolve(false);
                    }else{
                        try{
                            resolve(decoded.username);
                        }catch(error){
                            resolve(false);
                        }
                    }
                }
            );
        });
        return decoded_data
    }catch(error){
        if (error.name === 'TokenExpiredError') {
            throw new customError("Token has expired", 403, 'warn');
        } else {
            throw new customError("Invalid Token", 401, 'warn');
        }
    }


}