const FetchUser = require("../assetService/queries/users/fetchUser");
const FetchUserHandler = require("../assetService/queryHandlers/users/fetchUserHandler");
const customError = require("../utils/errors/customError");
const { verifyToken } = require("../utils/helpers/authHelpers/verifyToken");

exports.verifyUser = async function(req,res,next){
    try{
        // get auth header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if(!authHeader?.startsWith('Bearer ')){
            return next(new customError("Access Token not provided", 400, 'warn'));
        }
        // extract accessToken
        const token = authHeader.replace('Bearer ', '');
        // verify Token
        const decoded = await verifyToken(token)
        if(decoded === false){
            return next(new customError("Invalid token", 400, 'warn'))
        }
        // get user
        let user = undefined;
        const fetchUser = new FetchUser({username:decoded});
        const fetchUserHandler = new FetchUserHandler()
        user = await fetchUserHandler.handle(fetchUser);
        if(!user){
            return next(new customError("User not found for the given token", 404, 'warn'))
        }
        req.body.user = user
        next();
    }catch (error) {
        next(new customError("Failed to verify User", 500, 'error'))
    }
}