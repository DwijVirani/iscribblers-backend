const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo');
const env = require('../config/env');

const i18n = require('./i18n');
const passportJwtUtils = require('./passportJwtUtils');
const passportOAuth = require('./passportOAuth');

class Middlewares {
  init(app) {
    app.set('PORT', process.env.PORT || 5000);
    app.use(compression());
    app.use(
      cors({
        origin: '*',
      }),
    );
    app.use(helmet());
    app.use(bodyParser.json({ limit: '7mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
    // Init i18n into middleware
    app.use(i18n.init);
    app.use(fileUpload());

    /**
     * Passport middleware init
     */
    app.use(
      session({
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({ mongoUrl: env.DB_CONNECTION_STRING }),
        secret: env.EXPRESS_SECRET,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    /**
     * Passport strategy
     */
    passportJwtUtils(passport);
    passportOAuth(passport);

    app.use(
      morgan(function (tokens, req, res) {
        return [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'),
          '-',
          tokens['response-time'](req, res),
          'ms',
        ].join(' ');
      }),
    );
  }
}

const middlewareObj = new Middlewares();
module.exports = middlewareObj;
