const Razorpay = require('razorpay');
const env = require('./../config/env');
const projectService = require('./projectService');
const invoiceService = require('./invoiceService');

class PaymentService {
  async create(userId, projectId) {
    try {
      const project = await projectService.getSingle(userId, projectId);
      if (!project) throw Error('Project does not exists');
      else if (project.is_paid) throw Error('Payment is already done');

      const instance = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_SECRET,
      });

      const options = {
        amount: project.amount * 100,
        currency: 'INR',
      };
      const order = await instance.orders.create(options);
      if (order) return order;
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async updateProject(userId, projectId, payload) {
    try {
      const project = await projectService.getSingle(userId, projectId);
      if (!project) throw Error('Project does not exists');
      const projectPayload = {
        payments: {
          projectId: payload.projectId,
          paymentId: payload.paymentId,
          signature: payload.signature,
        },
        transaction_id: payload.paymentId,
        is_paid: true,
      };
      const result = await projectService.update(userId, projectId, projectPayload);
      if (result) {
        await invoiceService.create(userId, projectId);
        return result;
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  }
}

const paymentService = new PaymentService();
module.exports = paymentService;
