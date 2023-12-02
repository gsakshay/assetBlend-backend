const bcrypt = require('bcrypt');

exports.hashPassword = async function (password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds)
}


exports.comparePassword = async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};