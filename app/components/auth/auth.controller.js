const { createResponse, createError } = require('./../../utils/helpers');
const UserService = require('../../services/userService');
const { USER_ROLE_TYPES } = require('../../config/constants');

class AuthController {
  /**
   * @description Sign in with email and password
   */
  async signIn(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserService.validateUserCredential(username, password);
      if (user) {
        createResponse(res, 'ok', 'Login successful', user);
      } else {
        createError(res, {}, { message: 'Invalid Credentials' });
      }
    } catch (e) {
      createError(res, e);
    }
  }

  /**
   * @description signup new user
   */
  async signUp(req, res) {
    try {
      const user = await UserService.addNewUser(req.body, USER_ROLE_TYPES.USER);
      if (user) {
        createResponse(res, 'ok', 'Signup successful', user);
      } else {
        createError(res, {}, { message: 'Unable to create new user,please try again' });
      }
    } catch (e) {
      createError(res, e);
    }
  }

  /**
   * @description forgot password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await UserService.forgotPassword(email);
      if (user) {
        createResponse(res, 'ok', 'Password sent to email');
      } else {
        createError(res, {}, { message: 'User does not exist, please sign up first' });
      }
    } catch (e) {
      createError(res, e);
    }
  }

  /**
   * @description reset password
   */
  async resetPassword(req, res) {
    try {
      const { email, password, token } = req.body;
      const user = await UserService.resetPassword(email, password, token);
      if (user) {
        createResponse(res, 'ok', 'Password updated successfully');
      } else {
        createError(res, {}, { message: 'Unable to reset password,please try again' });
      }
    } catch (e) {
      createError(res, e);
    }
  }

  async googleSignIn(req, res) {
    try {
      const { user } = req;
      if (user) createResponse(res, 'ok', 'User logged in successfully', user);
      else createError(res, {}, { message: 'Unable to login,please try again' });
    } catch (e) {
      createError(res, e);
    }
  }
}

const authController = new AuthController();
module.exports = authController;
