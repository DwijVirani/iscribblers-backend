const moment = require('moment');
const Invoice = require('../models/invoice');
const Tax = require('../models/tax');
const RepositoryService = require('./repositoryService');
const { TAX_TYPES, TIMEZONE } = require('./../config/constants');
const { getNextNumber, getZonalTime } = require('./../utils/helpers');

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

  async getNextInvoice(userId, companyId, type) {
    try {
      const result = await Invoice.findOne({}).sort({ date: -1, createdAt: -1 });
      const lastInvoiceNo = result ? result.number : ``;
      let next_number;
      let isExist = false;
      do {
        next_number = getNextNumber(next_number || lastInvoiceNo, `INV-${moment().format('YY')}-`);
        isExist = await this.isInvoiceNumberExist(userId, companyId, type, next_number);
      } while (isExist);
      return next_number;
    } catch (e) {
      throw e;
    }
  }

  async create(userId, projectId) {
    try {
      const projectService = require('./projectService');

      const project = await projectService.getSingle(userId, projectId);
      const taxList = await Tax.find({});

      const billingAddress = {
        name: project.registered_company_name,
        address: project.company_address,
        country: project.country,
        state: project.state,
        state_code: project.state_code,
        zip_code: project.zipcode,
      };
      const date = new Date();
      const localDate = getZonalTime(date, TIMEZONE.IST_TIMEZONE_NAME);
      const formattedLocalDate = moment(localDate).format('YYYY-MMM-DD');

      const tax_rate = 18;
      const compnay_state_code = 24;
      const isSameState = Number(billingAddress.state_code) === Number(compnay_state_code);
      let taxItem;
      if (isSameState) taxItem = taxList.find((x) => x.tax_rate === tax_rate && x.is_group === true);
      else taxItem = taxList.find((x) => x.tax_rate === tax_rate && x.type === TAX_TYPES.IGST);

      const taxAmount = (1 * project.amount * taxItem.tax_rate) / 100;
      const invoicePayload = {
        number: await this.getNextInvoice(),
        date: formattedLocalDate,
        billing_address: billingAddress,
        shipping_address: billingAddress,
        items: [
          {
            project: project.id,
            rate: project.amount,
            discount: 0,
            tax: String(taxItem._id),
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
      await super.create(userId, invoicePayload);
    } catch (e) {
      throw e;
    }
  }

  async get(userId) {
    try {
      if (!userId) return;
      const result = await Invoice.find({ createdBy: userId });
      if (result) {
        return result.map((x) => {
          return x.toJSONWithObject();
        });
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async getPreview(userId, id) {
    try {
      if (!id) return;

      const result = await this.collection.findOneWithDeleted({ _id: id }).populate([
        { path: 'items.project' },
        { path: 'items.tax', populate: [{ path: 'group_taxes' }] },
        // { path: 'payments.created_by' },
        { path: 'createdBy' },
        { path: 'updatedBy' },
      ]);
      if (result) return result.toPreview();
      return undefined;
    } catch (e) {
      throw e;
    }
  }
}

const invoiceService = new InvoiceService();
module.exports = invoiceService;
