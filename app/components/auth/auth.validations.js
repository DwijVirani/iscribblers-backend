const { isEmpty } = require('./../../utils/validator');
const { createValidationResponse } = require('./../../utils/helpers');

class AuthenticationValidator {
  /**
   * @description Validate Sign in
   */
  signIn(req, res, next) {
    const errors = {};
    const { username, password } = req.body;

    if (isEmpty(username)) {
      errors.username = 'Username is required';
    }
    if (isEmpty(password)) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }

  /**
   * @description Validate Sign in
   */
  signUp(req, res, next) {
    const errors = {};
    const { first_name, last_name, email, password, country_code, phone, role } = req.body;
    if (isEmpty(first_name)) {
      errors.first_name = 'First Name is required';
    } else if (isEmpty(last_name)) {
      errors.password = 'Last Name is required';
    } else if (isEmpty(email)) {
      errors.password = 'Email is required';
    } else if (isEmpty(password)) {
      errors.password = 'Password is required';
    } else if (isEmpty(country_code)) {
      errors.country_code = 'Country code is required';
    } else if (isEmpty(phone)) {
      errors.phone = 'Phone number is required';
    } else if (isEmpty(role)) {
      errors.role = 'Role is required';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }

  /**
   * @description Validate Forgot Password
   */
  forgotPassword(req, res, next) {
    const errors = {};
    const { email } = req.body;

    if (isEmpty(email)) {
      errors.phone = 'Email is required';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }

  /**
   * @description Reset Password
   */
  resetPassword(req, res, next) {
    const errors = {};
    const { token, password } = req.body;

    if (isEmpty(token)) {
      errors.token = 'Token is required';
    }
    if (isEmpty(password)) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      createValidationResponse(res, errors);
    } else {
      next();
    }
  }
}

const validationObj = new AuthenticationValidator();
module.exports = validationObj;
