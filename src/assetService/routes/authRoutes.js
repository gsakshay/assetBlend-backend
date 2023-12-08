const express = require('express');
const router = express.Router();
const customError = require('../../utils/errors/customError')
const SignupCommand = require('../commands/signupCommand')
const SignupCommandHandler = require('../commandHandlers/signupCommandHandler')
const {validateSignupPayload} = require('../../middlewares/validateSignupPayload')
const LoginCommand = require('../commands/loginCommand');
const LoginHandler = require('../commandHandlers/loginHandler');
const RefreshToken = require('../commands/refreshToken');
const RefreshTokenHandler = require('../commandHandlers/refreshTokenHandler');
const Logout = require('../commands/logoutCommand');
const LogoutHandler = require('../commandHandlers/logoutHandler');
const RequestPasswordReset = require('../commands/requestPasswordReset');
const RequestPasswordResetHandler = require('../commandHandlers/requestPasswordResetHandler');
const ResetPassword = require('../commands/resetPassword');
const ResetPasswordHandler = require('../commandHandlers/resetPasswordHandler');
const { isNotAdminUser } = require('../../middlewares/isNotAdminUser');
const { hashPassword } = require('../../utils/helpers/hash');


router.post('/register', validateSignupPayload, isNotAdminUser, async (req,res,next)=>{
    try{
        const signupCommand = new SignupCommand(req.body);
        const signupCommandHandler = new SignupCommandHandler();
        let responseJson = undefined
        responseJson = await signupCommandHandler.handle(signupCommand)
        res.cookie('jwt', responseJson.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({username: responseJson.username, accessToken: responseJson.accessToken})
    }catch(error){
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }


})

router.post('/login', async (req, res, next)=> {
    try{
        const loginCommand = new LoginCommand(req.body)
        const loginHandler = new LoginHandler()
        const responseJson = await loginHandler.handle(loginCommand)
        res.cookie('jwt', responseJson.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({username: responseJson.username, accessToken: responseJson.accessToken})
    }catch(error){
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }
})


router.post('/refreshToken', async(req, res, next)=> {
    try{
        const refreshTokenCommand = new RefreshToken(req.cookies)
        const refreshHandler = new RefreshTokenHandler()
        const responseJson = await refreshHandler.handle(refreshTokenCommand)
        res.cookie('jwt', responseJson.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({username: responseJson.username, accessToken: responseJson.accessToken})
    }catch(error){
        console.log(error)
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }
})


router.post('/logout', async (req, res, next) => {
    try{

        const logoutCommand = new Logout(req.cookies)
        const logoutHandler = new LogoutHandler()
        const responseJson = await logoutHandler.handle(logoutCommand)
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.sendStatus(responseJson.status)
    }catch(error){
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }
})


router.post('/forgotPassword', async (req,res,next) => {
    try{
        const requestPasswordReset= new RequestPasswordReset(req.body.username)
        const requestPasswordResetHandler = new RequestPasswordResetHandler()
        const responseJson = await requestPasswordResetHandler.handle(requestPasswordReset)
        res.status(200).json(responseJson)
    }catch(error){
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }
})


router.post('/resetPassword', async (req,res,next) => {
    try{
        const data = req.body
        const resetPassword = new ResetPassword(data.resetToken, data.username, data.password)
        const resetPasswordHandler = new ResetPasswordHandler()
        const responseJson = await resetPasswordHandler.handle(resetPassword)
        res.status(200).json(responseJson)
    }catch(error){
        console.log(error)
        if(error instanceof customError){
            next(error)
        }else{
            next(new customError("Internal server error", 500, 'error'))
        }
    }
})

module.exports = router