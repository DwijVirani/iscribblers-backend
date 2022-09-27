const { hashSync, compareSync, genSaltSync } = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { EXPRESS_SECRET } = require('../config/env');

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    normalized_email: {
      type: String,
      required: true,
      unique: true,
    },
    country_code: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      // unique: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: Number,
      required: false,
    },
    extra1: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Number,
      required: false,
    },
    lastLogin: {
      type: Date,
    },
    ip: {
      type: String,
    },
    exp_indsutry: {
      type: String,
    },
    content_type_exp: [
      {
        type: String,
      },
    ],
    resume: [
      {
        name: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    linkedin_url: {
      type: String,
    },
    work_samples: [
      {
        name: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    author_bio_articles: {
      type: Boolean,
    },
    live_sample: {
      type: String,
    },
    refferal_site: {
      type: String,
    },
    years_of_exp: {
      type: Number,
    },
    expected_pay_per_word: {
      type: String,
    },
    current_job_type: {
      type: String,
    },
    creator_accepted: {
      type: Boolean,
      required: false,
      default: false,
    },
    creator_accepted_date: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true, usePushEach: true }, // UTC format
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.extra1 = this.password;
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const query = this;
  const update = query.getUpdate();
  if (update.password) {
    update.extra1 = update.password;
    update.password = hashSync(update.password, genSaltSync(8), null);
    return next();
  }
  return next();
});

userSchema.methods = {
  authenticateUser(password) {
    return compareSync(password, this.password);
  },

  _hashPassword(password) {
    return hashSync(password, genSaltSync(8), null);
  },

  createToken() {
    return jwt.sign(
      {
        id: this._id,
        first_name: this.first_name,
        email: this.email,
      },
      EXPRESS_SECRET,
      { expiresIn: '90d' },
    );
  },

  toAuthJSON() {
    return {
      id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      phone: this.phone,
      country_code: this.country_code,
      email: this.email,
      role: this.role,
      token: `${this.createToken()}`,
      is_new: this.is_new,
    };
  },

  toJSON() {
    return {
      id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      phone: this.phone,
      country_code: this.country_code,
      email: this.email,
      avatar: this.avatar,
      role: this.role,
      exp_indsutry: this.exp_indsutry,
      content_type_exp: this.content_type_exp,
      resume: this.resume,
      linkedin_url: this.linkedin_url,
      work_samples: this.work_samples,
      author_bio_articles: this.author_bio_articles,
      live_sample: this.live_sample,
      refferal_site: this.refferal_site,
      years_of_exp: this.years_of_exp,
      expected_pay_per_word: this.expected_pay_per_word,
      current_job_type: this.current_job_type,
      creator_accepted: this.creator_accepted,
      creator_accepted_date: this.creator_accepted_date,
      is_new: 0,
    };
  },
};
module.exports = mongoose.model('users', userSchema);
