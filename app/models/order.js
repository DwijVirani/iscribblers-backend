const mongoose = require('mongoose');
const User = require('./user');

const orderSchema = new mongoose.Schema(
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
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['business', 'creator', 'admin'],
      required: false,
    },
    extra1: {
      type: String,
      required: true,
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
  },
  { timestamps: true, usePushEach: true }, // UTC format
);

module.exports = mongoose.model('order', orderSchema);
