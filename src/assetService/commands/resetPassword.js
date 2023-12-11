class ResetPassword{
    constructor(resetToken, username, password){
        this.resetToken =  resetToken,
        this.username = username,
        this.password = password
    }
}

module.exports=ResetPassword