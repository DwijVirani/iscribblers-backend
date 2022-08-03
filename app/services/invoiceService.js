const Invoice = require('../models/invoice');
const Tax = require('../models/tax');
const RepositoryService = require('./repositoryService');

class InvoiceService extends RepositoryService {
  constructor() {
    super(Invoice);
  }
  async isInvoiceNumberExist(userId, companyId, type, invoice_no, id) {
    try {
      let query = { cid: companyId, type, number: invoice_no };
      if (id) query = { cid: companyId, type, number: invoice_no, _id: { $ne: id } };

      const result = await new Promise((resolve, reject) => {
        Invoice.countDocuments(query, (err, count) => {
          if (err) return reject(err);
          return resolve(count);
        });
      });
      if (result > 0) return true;
      return false;
    } catch (e) {
      throw e;
    }
  }

  async getNextInvoice() {
    try {
      const result = await Invoice.findOne({}).sort({ date: -1, createdAt: -1 });
      const lastInvoiceNo = result ? result.number : ``;
      const next_number = getNextNumber(next_number || lastInvoiceNo, `INV-${moment().format('YY')}-`);

      return next_number;
    } catch (e) {
      throw e;
    }
  }

  async createInvoice(userId, projectId) {
    try {
      const project = await this.getSingle(userId, projectId);
      const taxList = await Tax.find({});

      const billingAddress = {
        name: project.registered_company_name,
        address: project.company_address,
        country: project.country,
        state: project.state,
        state_code: project.state_code,
        zip_code: project.zipcode,
      };
      const tax_rate = 18;
      const compnay_state_code = 24;
      const isSameState = Number(billingAddress.state_code) === Number(compnay_state_code);
      if (isSameState) taxItem = taxList.find((x) => x.tax_rate === tax_rate && x.is_group === true);
      else taxItem = taxList.find((x) => x.tax_rate === tax_rate && x.type === TAX_TYPES.IGST);

      const taxAmount = (1 * project.amount * taxItem.tax_rate) / 100;
      const invoicePayload = {
        number: await this.getNextInvoice(),
        date: moment(new Date()).format('YYYY-MMM-DD'),
        billing_address: billingAddress,
        shipping_address: billingAddress,
        items: [
          {
            project: project.id,
            rate: project.amount,
            discount: 0,
            tax: taxItem._id,
            tax_rate: taxItem.tax_rate,
            discount_amount: 0,
            tax_amount: taxAmount,
            amount: project.amount,
          },
        ],
        sub_total_amount: project.amount,
        total_tax: taxAmount,
        total_amount: Number(project.amount) + Number(taxAmount),
        createdBy: userId,
        updatedBy: userId,
      };
      await super.create(invoicePayload);
    } catch (e) {
      throw e;
    }
  }
}

const invoiceService = new InvoiceService();
module.exports = invoiceService;
