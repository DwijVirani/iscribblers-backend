const UserService = require('../../services/userService');
const { createResponse, createError } = require('./../../utils/helpers');

class AuthController {
  /**
   * @description get current user profile
   */
  async getMyProfile(req, res) {
    try {
      const { user } = req;
      if (user) {
        createResponse(res, 'ok', 'My Profile', user.toJSON());
      } else {
        createError(res, {}, { message: 'User not found' });
      }
    } catch (e) {
      createError(res, e);
    }
  }

  /**
   * @description change password
   */
  async updatePassword(req, res) {
    try {
      if (req.user) {
        const { password, new_password } = req.body;
        const result = await UserService.changePassword(req.user.id, password, new_password);
        if (result) {
          createResponse(res, 'ok', 'Password changed successfully');
        } else {
          createError(res, {}, { message: 'Unable to change password' });
        }
      } else {
        createError(res, {}, { message: 'User not found' });
      }
    } catch (e) {
      createError(res, e);
    }
  }

  /**
   * @description update user
   */
  async updateUser(req, res) {
    try {
      if (req.user) {
        const { user } = req;
        const payload = { ...req.body };
        const result = await UserService.updateUserProfile(user.id, payload);
        if (result) {
          createResponse(res, 'ok', 'User profile updated successfully', result);
        } else {
          createError(res, {}, { message: 'Unable to update user profile' });
        }
      } else {
        createError(res, {}, { message: 'User not found' });
      }
    } catch (e) {
      createError(res, e);
    }
  }
}

const authController = new AuthController();
module.exports = authController;
