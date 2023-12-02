const jwt = require('jsonwebtoken');
const customError = require('../utils/errors/customError');
const FetchUserByUsernameQuery = require('../assetService/queries/FetchUserByUsernameQuery');
const FetchUserByUsernameQueryHandler = require('../assetService/queryHandlers/fetchUserByUsernameHandler');
const {validateEmail} = require('../utils/helpers/validateEmail')
const {validatePassword} = require('../utils/helpers/validatePassword')


exports.validateSignupPayload = async function(req, res, next) {
    const payload = req.body;

    if(!payload.username || !payload.password || !payload.email || !payload.firstName || !payload.lastName || !payload.phone) {
        return next(new customError("Missing parameters. Expecting username, password, email, firstName, lastName, phone", 400, 'warn'))
    }else{

        //check username already exists
        const {username} = req.body;
        let user = undefined;
        const fetchByUsernameQuery = new FetchUserByUsernameQuery(username);
        const fetchByUsernameQueryHandler = new FetchUserByUsernameQueryHandler()
        user = await fetchByUsernameQueryHandler.handle(fetchByUsernameQuery);

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

        next();
    }
}