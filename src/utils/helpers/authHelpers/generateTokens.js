const jwt = require('jsonwebtoken')
const constants = require('../../constants/index')
const customError = require('../../errors/customError')

exports.generateAccessToken = function(userPayload) {
    return jwt.sign(
        {
            username: userPayload.username
        },
        constants.JWT_SECRET,
        {
            expiresIn: '15h', // reduce time later
        }
    );
};

exports.generateRefreshToken = function(userPayload) {
    return jwt.sign(
        {
            username: userPayload.username
        },
        constants.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    );
}


exports.generateResetToken = function(userPayload) {
    return jwt.sign(
        {
            username: userPayload.username
        },
        constants.JWT_SECRET,
        {
            expiresIn: '24h',
        }
    )
}