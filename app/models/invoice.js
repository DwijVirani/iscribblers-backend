const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const project = require('./project');
const Schema = mongoose.Schema;

const invoiceSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    date: {
      type: Schema.Types.Date,
      required: true,
    },
    billing_address: {
      type: Schema.Types.Mixed,
      // required: true,
    },
    shipping_address: {
      type: Schema.Types.Mixed,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: project,
          required: true,
        },
        hsn_code: { type: String, trim: true, required: false },
        qty: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        //   tax_inclusive_rate: {
        //     type: Number,
        //     trim: true,
        //     required: false,
        //   },
        discount: {
          type: Number,
        },
        //   tax: {
        //     type: Schema.Types.ObjectId,
        //     ref: tax,
        //     required: true,
        //   },
        tax_rate: {
          type: Schema.Types.Number,
          required: true,
        },
        discount_amount: {
          type: Schema.Types.Number,
          required: true,
        },
        tax_amount: {
          type: Schema.Types.Number,
          required: true,
        },
        amount: {
          type: Schema.Types.Number,
          required: true,
        },
      },
    ],
    sub_total_amount: {
      type: Number,
      required: true,
    },
    total_tax: {
      type: Number,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    deletedBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, usePushEach: true },
);
invoiceSchema.methods = {
  toJSONWithObject(hasFullInvoice = false) {
    return {
      id: this._id,
      deleted: this.deleted,
      number: this.number,
      billing_address: this.billing_address,
      shipping_address: this.shipping_address,
      date: this.date,
      date_formatted: moment(this.date).format('DD/MM/YYYY'),
      items: hasFullInvoice
        ? this.items.map((item) => {
            // eslint-disable-next-line no-shadow
            const product = item.product && !isNull(item.product) ? item.product.toJSON() : {};
            if (item.product_details) product.name = item.product_details.name;
            return {
              id: item._id,
              product,
              desc: item.desc,
              hsn_code: item.hsn_code || product.hsn_code,
              qty: item.qty,
              rate: mathRounding(item.rate, 3),
              discount: item.discount,
              tax: item.tax && !isNull(item.tax) ? item.tax.toJSON() : undefined,
              tax_rate: item.tax_rate,
              discount_amount: mathRounding(item.discount_amount, 3),
              tax_amount: mathRounding(item.tax_amount, 3),
              amount: mathRounding(Number(item.amount) + Number(item.tax_amount), 3),
              amount_without_tax: mathRounding(Number(item.amount), 3),
            };
          })
        : [],
      total_qty: this.items.reduce((sum, item) => sum + Number(item.qty), 0),
      sub_total_amount: mathRounding(this.sub_total_amount, 3),
      total_discount: mathRounding(this.total_discount, 3),
      total_tax: mathRounding(this.total_tax, 3),
      total_amount: mathRounding(this.totalAmount, 3),
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    };
  },

  toPreview() {
    const invoice = this.toJSONWithObject(true);
    const items = invoice.items || [];
    const taxItems = [];
    items.forEach((item) => {
      const tax_item = item.tax;
      if (tax_item) {
        if (tax_item.type === TAX_TYPES.GROUP) {
          (tax_item.group_taxes || []).forEach((taxItem) => {
            taxItems.push({
              tax: taxItem,
              amount: item.amount_without_tax / tax_item.group_taxes.length,
              tax_rate: taxItem.tax_rate,
              tax_amount: (taxItem.tax_rate * item.amount_without_tax) / 100,
            });
          });
        } else {
          taxItems.push({
            tax: tax_item,
            amount: item.amount_without_tax,
            tax_rate: tax_item.tax_rate,
            tax_amount: (tax_item.tax_rate * item.amount_without_tax) / 100,
          });
        }
      }
      item.is_discount = Number(invoice.total_discount) !== 0;
      item.is_tax = Number(invoice.total_tax) !== 0;
    });
    const taxRateGrouping = groupBy(taxItems, 'tax.tax_rate');
    const taxes = taxRateGrouping.map((item) => {
      const taxRate = item.name;
      const amount = item.value.reduce((sum, x) => sum + x.amount, 0);

      const CGST = item.value
        .filter((x) => x.tax.type === TAX_TYPES.CGST)
        .reduce((sum, x) => sum + Number(x.tax_amount), 0);

      const SGST = item.value
        .filter((x) => x.tax.type === TAX_TYPES.SGST)
        .reduce((sum, x) => sum + Number(x.tax_amount), 0);

      const IGST = item.value
        .filter((x) => x.tax.type === TAX_TYPES.IGST)
        .reduce((sum, x) => sum + Number(x.tax_amount), 0);
      // const CGST = item.value.tax.type === TAX_TYPES.CGST ? item.value : 0;
      return {
        amount: mathRounding(amount),
        tax_rate: Number(taxRate),
        cgst: mathRounding(CGST),
        sgst: mathRounding(SGST),
        igst: mathRounding(IGST),
      };
    });

    const taxes_total = {
      total_taxable_amount: mathRounding(
        taxes.reduce((sum, item) => sum + Number(item.amount), 0),
        2,
      ),
      total_cgst: mathRounding(
        taxes.reduce((sum, item) => sum + Number(item.cgst), 0),
        2,
      ),
      total_sgst: mathRounding(
        taxes.reduce((sum, item) => sum + Number(item.sgst), 0),
        2,
      ),
      total_igst: mathRounding(
        taxes.reduce((sum, item) => sum + Number(item.igst), 0),
        2,
      ),
    };
    const { ToWords } = require('to-words');
    const toWords = new ToWords({
      localeCode: 'en-IN',
      converterOptions: {
        currency: true,
        ignoreDecimal: true,
        ignoreZeroCurrency: true,
      },
    });

    return {
      company: company_details,
      invoice: {
        ...invoice,
        amount_in_word: toWords.convert(invoice.total_amount),
      },
      taxes,
      taxes_total,
    };
  },
};
module.exports = mongoose.model('invoice', invoiceSchema);
