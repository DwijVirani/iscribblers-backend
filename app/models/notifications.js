const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const User = require('./user');
const Project = require('./project');

const Schema = mongoose.Schema;

const notificationsSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    message: {
      type: String,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Project,
    },
    status: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: false,
    },
    deletedBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, usePushEach: true },
);

notificationsSchema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

notificationsSchema.methods = {
  toJSON() {
    return {
      id: this._id,
      user: this.user ? this.user.toJSON() : {},
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
};

module.exports = mongoose.model('notification', notificationsSchema);
