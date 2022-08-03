const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    tax_rate: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true, // NIL = 0, CGST = 1, SGST = 2, IGST = 3,UTGST = 4,
    },
    is_group: {
      type: Boolean,
      required: false,
      default: false,
    },
    group_taxes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tax',
        required: true,
      },
    ],
    createdBy: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: String,
      trim: true,
    },
    deletedBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, usePushEach: true }, // UTC format
);

taxSchema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

taxSchema.methods = {
  toJSON() {
    return {
      id: this._id,
      name: this.name,
      label: `${this.name || ''} ${this.tax_rate}%`,
      description: this.description,
      tax_rate: this.tax_rate,
      type: this.type,
      is_group: this.is_group,
      group_taxes: this.group_taxes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};
module.exports = mongoose.model('tax', taxSchema);
