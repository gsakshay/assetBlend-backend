const passwordValidator = require('password-validator')

const PasswordValidatorSchema = function() {
    const schema = new passwordValidator()

    schema
        .is().min(8) // Minimum length 8
        .has().uppercase() // Must have uppercase letters
        .has().digits() // Must have at least one digit
        .has().symbols(); // Must have at least one symbol
    return schema

}


exports.validatePassword = function(inputPassword) {
    const passwordValidator = PasswordValidatorSchema();
    const validationResult = passwordValidator.validate(inputPassword, { list: true });
    if (validationResult.length === 0) {
        return { valid: true };
      } else {
        const errorMessage = `Password does not meet the requirements. It should have atleast one ${validationResult.join(', ')}`;
        return { valid: false, message: errorMessage };
      }
} 