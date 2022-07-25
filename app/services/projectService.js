const uuid = require('uuid');
const Project = require('../models/project');
const Invoice = require('../models/invoice');
const UserService = require('./userService');
const RepositoryService = require('./repositoryService');
const env = require('./../config/env');

const stripe = require('stripe')(env.STRIPE_SECRET_KEY);
const validateProjectInputs = (project) => {
  try {
    if (!project.project_type) throw Error('Project type is required');
    else if (!project.project_name) throw Error('Project name is required');
    else if (!project.genre) throw Error('Project genre is required');
    else if (!project.sub_genre) throw Error('Project sub genre name is required');
    else if (!project.target_audience) throw Error('Target audience is required');
    else if (!project.project_purpose) throw Error('Project purpose is required');
    else if (!project.content_title) throw Error('Content title is required');
    else if (!project.word_count) throw Error('Word Count is required');
    else if (!project.conent_language) throw Error('Content language is required');
    else if (!project.content_intent) throw Error('Content intent is required');
    else if (!project.content_perpective) throw Error('Content perpective is required');
    else if (!project.content_tone) throw Error('Content tone is required');
    else if (!project.company_name) throw Error('Company name is required');
    else if (!project.company_primary_industry) throw Error('Company industry is required');
    else if (!project.writer) throw Error('Writer is required');
    else if (!project.registered_company_name) throw Error('Registered company name is required');
    else if (!project.company_address) throw Error('Comapny address is required');
    else if (!project.country) throw Error('Country is required');
    else if (!project.zip_code) throw Error('Zip Code is required');
    else if (!project.state) throw Error('State is required');
    return true;
  } catch (e) {
    throw e;
  }
};

class ProjectService extends RepositoryService {
  constructor() {
    super(Project);
  }

  async create(userId, payload) {
    try {
      if (!payload) return;
      if (validateProjectInputs(payload)) {
        const result = await super.create(userId, payload);
        if (result) return result;
        return undefined;
      }
    } catch (e) {
      throw e;
    }
  }

  async getSingle(userId, id) {
    try {
      if (!id) return;

      const result = await Project.findOne({ createdBy: userId, _id: id });
      if (result) return result;
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async get(userId) {
    try {
      const result = await Project.find({ createdBy: userId });
      if (result)
        return result.map((item) => {
          return item.toJSON();
        });
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async delete(userId, id) {
    try {
      if (!id) return;
      const item = await this.getSingle(userId, id);
      if (!item) throw Error('Project does not exists');

      const result = await Project.delete({ _id: id });
      return true;
    } catch (e) {
      throw e;
    }
  }

  async payment(userId, projectId) {
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
  async createInvoice(userId) {
    try {
      const invoicePayload = {
        number: await this.getNextInvoice(),
      };
    } catch (e) {
      throw e;
    }
  }
}

const service = new ProjectService();
module.exports = service;
