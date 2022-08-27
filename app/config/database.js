/* eslint-disable no-console */

/**
 * Configuration for the database
 */

const mongoose = require('mongoose');

// Remove the warning with Promise
mongoose.Promise = global.Promise;

// If debug run the mongoose debug options
mongoose.set('debug', process.env.MONGOOSE_DEBUG);
const connect = (url) => mongoose.connect(url);
module.exports = connect;
