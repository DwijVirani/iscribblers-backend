const authRoutes = require('../components/auth/auth.route');

module.exports = (app) => {
    app.use('/api/auth', authRoutes);
};