const authRoutes = require('../components/auth/auth.route');
const projectRoutes = require('../components/project/project.route');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/project', projectRoutes);
};
