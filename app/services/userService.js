const crypto = require('crypto');
const User = require('../models/user');
const constants = require('../config/constants');
const { sendEmail } = require('../utils/sendgrid');
const { USER_TYPE } = require('../config/constants');
const RepositoryService = require('./repositoryService');

class UserService extends RepositoryService {
  constructor() {
    super(User);
  }

  /**
   * @description Get User
   */
  async getUser(id) {
    try {
      const result = await User.findOne({ _id: id });
      return result.toJSON();
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

  async findOrCreate(userProfile) {
    try {
      const user = await User.findOne({ email: userProfile.email });
      const userPayload = {
        first_name: userProfile.given_name,
        last_name: userProfile.family_name,
        email: userProfile.email,
        avatar: userProfile.picture,
      };
      if (!user) {
        const newUser = await this.addNewUser(userPayload);
        return { ...newUser, is_new: 1 };
      }
      if (user) return user.toAuthJSON();
    } catch (e) {
      throw e;
    }
  }

  async getUserByUsernameRaw(username) {
    const normalized_username = String(username).toUpperCase().trim();
    const user = await User.findOne({
      $or: [{ email: username }, { normalized_email: normalized_username }],
    });
    return user;
  }

  async validateUserCredential(username, password) {
    const normalized_username = String(username).toUpperCase().trim();
    const user = await User.findOne({
      $or: [{ email: username }, { normalized_email: normalized_username }],
    });
    if (!user) return null;
    if (
      (user && user.role === constants.USER_ROLE_TYPES.CREATOR) ||
      (constants.USER_ROLE_TYPES.BUSINESS && user.authenticateUser(password))
    ) {
      return user.toAuthJSON();
    }
    return null;
  }

  /**
   * @description Add new User
   * @param {Object} obj
   */
  addNewUser(obj) {
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
    try {
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
                `Hello ${user.first_name},<BR /> <a href="http://localhost:3000/api/auth/reset-password?token=${token}">Click here</a> for reset password <BR />iScribblers Team`,
              );

              return resolve(true);
            },
          );
        });
        return promisResult;
      }
      return false;
    } catch (e) {
      throw e;
    }
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

  async updateUserProfile(user_id, payload) {
    try {
      const user = await User.findOne({
        _id: user_id,
      });
      if (!user) throw Error('User not exit');

      const result = await super.update(user_id, user_id, payload);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addUserPhoneAndRole(userId, payload) {
    try {
      const user = await User.findOne({
        _id: userId,
      });
      if (!user) throw Error('User not exit');

      payload.is_new = 0;
      const result = await User.findOneAndUpdate({ _id: userId }, payload, { new: true });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getCreatorList() {
    try {
      const result = await User.find({ role: USER_TYPE.CREATOR });
      if (result) return result;
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async getUserDetails(userId) {
    try {
      if (userId) {
        const user = await User.findOne({ _id: userId });
        if (user) return user.toJSON();
        return undefined;
      }
    } catch (e) {
      throw e;
    }
  }
}

const userService = new UserService();
module.exports = userService;
