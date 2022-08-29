const path = require('path');
const dotenv = require('dotenv');

/**
 * Load environment variables from .env file
 */
const envPostFix = process.env.APP_ENV ? `.${process.env.APP_ENV}` : '';

dotenv.config({
  path: path.resolve(__dirname, `../../.env${envPostFix}`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.APP_ENV,
  APP_BASE_URL: process.env.APP_BASE_URL,
  PORT: process.env.PORT,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  EXPRESS_SECRET: process.env.EXPRESS_SECRET,
  MAX_RESPONSE_TIME: process.env.MAX_RESPONSE_TIME || 10000,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_SENDER_EMAIL: process.env.SENDGRID_SENDER_EMAIL,
  SENDGRID_SENDER_NAME: process.env.SENDGRID_SENDER_NAME,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  GCLOUD_STORAGE_BUCKET: process.env.GCLOUD_STORAGE_BUCKET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
  JS_REPORT_URL: process.env.JS_REPORT_URL,
  JS_REPORT_USERNAME: process.env.JS_REPORT_USERNAME,
  JS_REPORT_PASSWORD: process.env.JS_REPORT_PASSWORD,
};
