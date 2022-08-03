class PaymentService {
  async create(userId, projectId) {
    try {
      const project = await this.getSingle(userId, projectId);
      if (!project) throw Error('Project does not exists');

      const user = await UserService.getUser(userId);
      if (!user) return;

      console.log('project', project.amount);
      const idempotencyKey = uuid.v4();
      const customer = await stripe.customers.create({
        email: user.email,
        source: user.id,
      });
      console.log(customer);
      if (customer) {
        const result = await stripe.charges.create(
          {
            amount: project.price * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: customer.email,
            description: `Payment for project: ${project.project_name} is successful`,
          },
          { idempotencyKey },
        );
        console.log('result', result);
      }
    } catch (e) {
      throw e;
    }
  }
}

const paymentService = new PaymentService();
module.exports = paymentService;
