const express = require('express');
const customError = require('../../utils/errors/customError');
const { verifyUser } = require('../../middlewares/verifyUser');
const FetchUserByRole = require('../queries/fetchAdvisorList');
const FetchUserByRoleHandler = require('../queryHandlers/fetchAdvisorListHandler');
const router = express.Router();

router.get('/', verifyUser, async (req,res,next)=> {
    try{
        const fetchAdvisors = new FetchUserByRole("ADVISOR")
        const fetchAdvisorsHandler = new FetchUserByRoleHandler()
        const advisorList = await fetchAdvisorsHandler.handle(fetchAdvisors)
        res.status(200).json(advisorList)
    }catch(error){
        console.log(error)
        next(new customError("failed to fetch advisors list", 500, 'error'))
    }
    
})

module.exports = router