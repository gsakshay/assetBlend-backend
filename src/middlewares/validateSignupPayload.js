const jwt = require('jsonwebtoken');
const customError = require('../utils/errors/customError');
const FetchUser = require('../assetService/queries/users/fetchUser');
const FetchUserHandler = require('../assetService/queryHandlers/users/fetchUserHandler');
const {validateEmail} = require('../utils/helpers/validateEmail')
const {validatePassword} = require('../utils/helpers/validatePassword');
const FetchRole = require('../assetService/queries/roles/fetchRole');
const FetchRoleHandler = require('../assetService/queryHandlers/roles/fetchRoleHandler');
const constants = require('../utils/constants/index')

exports.validateSignupPayload = async function(req, res, next) {
    
    try{
        const payload = req.body;
        if(!payload.username || !payload.password || !payload.email || !payload.firstName || !payload.lastName || !payload.phone) {
            return next(new customError("Missing parameters. Expecting username, password, email, firstName, lastName, phone", 400, 'warn'))
        }else{
    
            //check username already exists
            const {username} = req.body;
            let user = undefined;
            const fetchUser = new FetchUser({username:username});
            const fetchUserHandler = new FetchUserHandler()
            user = await fetchUserHandler.handle(fetchUser);
    
            if(user){
                return next(new customError("Username already in use", 400, 'warn'));
            }
    
            // validate email
            if(!validateEmail(payload.email)) {
                return next(new customError("Invalid email. Please provide a valid email", 400, 'warn'));
            }      
    
            //validate password(basic)
            const isValidPassword = validatePassword(payload.password);
            if(!isValidPassword.valid) {
                return next(new customError(isValidPassword.message, 400, 'warn'));
            }
    
            // role exists check
            
            let finalRole = null
            const fetchRoleHandler = new FetchRoleHandler()
            if(payload.role){
                const role = payload.role
                // check valid id
                try{
                    const fetchRoleById = new FetchRole({_id:role})
                    finalRole = await fetchRoleHandler.handle(fetchRoleById)
                    // set fetched role
                    req.body.role = finalRole
                }catch(err){
                    return next(new customError("Invalid role ID", 400, 'warn'))
                }                
            }else{
                // set to user role
                const fetchDefaultRole = new FetchRole({roleName:constants.ROLES.CILENT})
                finalRole = await fetchRoleHandler.handle(fetchDefaultRole)
                req.body.role = finalRole
                
            } 
            next();
        }
    }catch(error){
        next(new customError('Failed to validate signup payload', 500, 'error'))
    }
}