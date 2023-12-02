const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const customError = require('../../utils/errors/customError')
const SignupCommand = require('../commands/signupCommand')
const SignupCommandHandler = require('../commandHandlers/signupCommandHandler')
const {validateSignupPayload} = require('../../middlewares/validateSignupPayload')
const {isAdminRegisterRequest} = require('../../middlewares/isAdminRegister')


router.post('/register', validateSignupPayload, isAdminRegisterRequest, async (req,res,next)=>{
    try{
        const signupCommand = new SignupCommand(req.body);
        const signupCommandHandler = new SignupCommandHandler();
        const responseJson = await signupCommandHandler.handle(signupCommand, req, res, next)
        res.status(200).json(responseJson)
    }catch(error){
        next(new customError("Internal server error", 500, 'error'))
    }


})

module.exports = router