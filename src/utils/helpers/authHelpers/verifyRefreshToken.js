const constants = require('../../constants/index')
const jwt = require("jsonwebtoken")

exports.verifyRefreshToken = async function(refreshToken){
    try{
        const decoded_data =  await new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken, constants.JWT_SECRET,
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
        console.log(decoded_data)
        return decoded_data
    }catch(error){
        if (error.name === 'TokenExpiredError') {
            throw new customError("Token has expired", 403, 'warn');
        } else {
            throw new customError("Invalid Token", 401, 'warn');
        }
    }


}