const crypto = require('crypto');
const User = require('../models/user');
const constants = require('../config/constants');
const { sendEmail } = require('../utils/sendgrid');

class UserService {
  /**
   * @description Get User
   */
  async getUser(id) {
    try {
      const result = await User.find({ _id: id });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getUserByUsername(username) {
    const normalized_username = String(username).toUpperCase().trim();
    const user = await User.findOne({
      $or: [{ email: username }, { normalized_email: normalized_username }],
    });
    if (user) return user.toAuthJSON();

    return null;
  }

  async getUserByUsernameRaw(username) {
    const normalized_username = String(username).toUpperCase().trim();
    const user = await User.findOne({
      $or: [{ email: username }, { normalized_email: normalized_username }],
    });
    return user;
  }

  async validateUserCredential(username, password, role) {
    const normalized_username = String(username).toUpperCase().trim();
    const user = await User.findOne({
      $or: [{ email: username }, { normalized_email: normalized_username }],
    });
    if (!user) return null;
    if (role === constants.USER_ROLE_TYPES.USER) {
      if (user && user.role === role && user.authenticateUser(password)) {
        return user.toAuthJSON();
      }
    }
    return null;
  }

  /**
   * @description Add new User
   * @param {Object} obj
   */
  addNewUser(obj, role) {
    return new Promise(async (resolve, reject) => {
      try {
        const body = { ...obj };
        body.email = String(body.email).toLowerCase();
        User.findOne(
          {
            $or: [
              {
                email: body.email,
              },
            ],
          },
          (err, existingUser) => {
            if (err) {
              reject(err);
              return;
            }

            // If user is not unique, return error
            if (existingUser) {
              reject({
                message: 'That email is already in use.',
              });
              return;
            }

            // If username is unique and password was provided, submit account
            const user = new User({
              ...body,
              extra1: body.password,
              normalized_email: String(body.email).toUpperCase(),
              role,
            });

            user.save((err2, item) => {
              if (err2) {
                reject(err2);
                return;
              }
              resolve(item.toAuthJSON());
            });
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async forgotPassword(username) {
    const normalized_username = String(username).toUpperCase().trim();
    const token = crypto.randomBytes(32).toString('hex');
    const query = {
      $or: [{ email: username }, { normalized_email: normalized_username }],
    };
    const userResult = await User.findOne(query);
    if (userResult) {
      const user = userResult.toJSON();
      const promisResult = await new Promise(async (resolve, reject) => {
        User.findOneAndUpdate(
          query,
          { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 },
          { new: true },
          async (err) => {
            if (err) reject(err);
            await sendEmail(
              user.email,
              'Reset iScribblers Password',
              // eslint-disable-next-line max-len
              `Hello ${user.name},<BR /> <a href="https://iscribblers-dev.herokuapp.com/reset-password?token=${token}">Click here</a> for reset password <BR />iScribblers Team`,
            );

            return resolve(true);
          },
        );
      });
      return promisResult;
    }
    return false;
  }

  async resetPassword(username, password, token) {
    const normalized_username = String(username).toUpperCase().trim();

    const query = {
      $or: [{ email: username }, { normalized_email: normalized_username }],
      $and: [{ resetPasswordToken: token }, { resetPasswordExpires: { $gt: Date.now() } }],
    };
    const userResult = await User.findOne(query);
    if (userResult) {
      // const user = userResult.toJSON();
      const promisResult = await new Promise(async (resolve, reject) => {
        User.findOneAndUpdate(
          query,
          { password, $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } },
          { new: true },
          async (err) => {
            if (err) reject(err);
            return resolve(true);
          },
        );
      });
      return promisResult;
    }
    throw Error('Invalid token');
  }

  async changePassword(user_id, password, new_password) {
    try {
      const user = await User.findOne({
        _id: user_id,
      });
      if (user.authenticateUser(password)) {
        const condition = {
          _id: user_id,
        };
        const doc = {
          password: new_password,
        };
        const promisResult = await new Promise(async (resolve, reject) => {
          User.findOneAndUpdate(condition, doc, async (err) => {
            if (err) reject(err);
            return resolve(true);
          });
        });
        return promisResult;
      } else {
        throw Error('Wrong password');
      }
    } catch (err) {
      throw err;
    }
  }

  async updateUserProfile(user_id, avatar, name, phone, language) {
    try {
      const user = await User.findOne({
        _id: user_id,
      });
      if (!user) throw Error('User not exit');

      const condition = {
        _id: user_id,
      };
      const doc = {
        name,
        phone,
        avatar,
        language,
      };
      const promisResult = await new Promise(async (resolve, reject) => {
        User.findOneAndUpdate(condition, doc, async (err) => {
          if (err) reject(err);
          return resolve(true);
        });
      });
      if (promisResult) return this.getUser(user_id);
    } catch (err) {
      throw err;
    }
  }
}

const userService = new UserService();
module.exports = userService;
