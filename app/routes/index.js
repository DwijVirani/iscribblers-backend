const authRoutes = require('../components/auth/auth.route');
const projectRoutes = require('../components/project/project.route');
const mediaRoutes = require('../components/media/media.route');
const userRoutes = require('../components/user/user.route');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/project', projectRoutes);
  app.use('/api/media', mediaRoutes);
};
