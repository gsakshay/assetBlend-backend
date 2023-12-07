const customError = require('../utils/errors/customError')

exports.errorHandler = function(err,req,res,next) {
    if(err instanceof customError) {
        res.status(err.status).json(err.toResponseJSON())
    }else{
        res.status(500).json({message: "Internal server error"})
    }
}