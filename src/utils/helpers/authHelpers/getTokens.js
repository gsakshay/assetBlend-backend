const {generateAccessToken, generateRefreshToken} = require('./generateTokens')

exports.getAuthTokens = function(userPayload) {
    const accessToken = generateAccessToken(userPayload)
    const refreshToken = generateRefreshToken(userPayload)
    return {accessToken, refreshToken}
}