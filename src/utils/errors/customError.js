class customError extends Error {
    constructor(message, status=500, logLevel='warn'){
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
        this.logLevel = logLevel; 
    }
    toResponseJSON() {
        return {
            message : this.message
        };
    }
}

module.exports = customError