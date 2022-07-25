const { isEmpty } = require('./../../utils/validator');
const { createValidationResponse } = require('./../../utils/helpers');

class UserValidator {
  /**
   * @description Reset Password
   */
  updatePassword(req, res, next) {
    const errors = {};
    const { password, new_password, confirm_password } = req.body;

    if (isEmpty(password)) {
      errors.password = 'Password is required';
    }
    if (isEmpty(new_password)) {
      errors.new_password = 'New Password is required';
    }
    if (isEmpty(confirm_password)) {
      errors.confirm_password = 'Confirm Password is required';
    }
    if (confirm_password !== new_password) {
      errors.confirm_password = 'Password not matched with confirm password';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }

  /**
   * @description Update Profile
   */
  updateProfile(req, res, next) {
    const errors = {};
    const { name } = req.body;

    if (isEmpty(name)) {
      errors.name = 'Name is required';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }
}

const validationObj = new UserValidator();
module.exports = validationObj;
