const authRoutes = require('../components/auth/auth.route');
const projectRoutes = require('../components/project/project.route');
const mediaRoutes = require('../components/media/media.route');
const userRoutes = require('../components/user/user.route');
const paymentRoutes = require('../components/payment/payment.route');
const invoiceRoutes = require('../components/invoice/invoice.route');
const taxRoutes = require('../components/tax/tax.route');
const dashboardRoutes = require('./../components/dashboard/dashboard.route');
const notificationsRoutes = require('./../components/notifications/notifications.route');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/project', projectRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/invoice', invoiceRoutes);
  app.use('/api/tax', taxRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/notifications', notificationsRoutes);
};
