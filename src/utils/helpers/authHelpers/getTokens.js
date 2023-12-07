const {generateAccessToken, generateRefreshToken} = require('./generateTokens')

exports.getAuthTokens = function(userPayload) {
    console.log(userPayload)
    const accessToken = generateAccessToken(userPayload)
    const refreshToken = generateRefreshToken(userPayload)
    return {accessToken, refreshToken}
}