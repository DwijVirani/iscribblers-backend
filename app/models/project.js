const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const User = require('./user');

const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema(
  {
    project_type: {
      type: Number,
      required: true,
    },
    project_name: {
      type: String,
      required: true,
    },
    industry: {
      type: Number,
      required: true,
    },
    sub_industry: {
      type: Number,
      required: true,
    },
    target_audience: {
      type: String,
      required: true,
    },
    project_purpose: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    content_title: {
      type: String,
      required: true,
    },
    content_purpose: {
      type: String,
      required: false,
    },
    word_count: {
      type: Number,
      required: true,
    },
    article_usage: {
      type: String,
      required: false,
    },
    primary_keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    secondary_keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    call_to_actions: {
      type: String,
    },
    additional_instructions: [
      {
        instructions: {
          type: String,
        },
        url: {
          type: String,
          trim: true,
        },
        name: {
          type: String,
          trim: true,
        },
      },
    ],
    conent_language: {
      type: Number,
      required: true,
    },
    content_intent: {
      type: Number,
      required: true,
    },
    content_perpective: {
      type: Number,
      required: true,
    },
    content_tone: {
      type: Number,
      required: true,
    },
    outline_structure: [
      {
        instructions: {
          type: String,
        },
        url: {
          type: String,
          trim: true,
        },
        name: {
          type: String,
          trim: true,
        },
      },
    ],
    meta_description: {
      type: Boolean,
    },
    overall_instructions: [
      {
        instructions: {
          type: String,
        },
        url: {
          type: String,
          trim: true,
        },
        name: {
          type: String,
          trim: true,
        },
      },
    ],
    company_name: {
      type: String,
      required: true,
    },
    company_primary_industry: {
      type: Number,
      required: true,
    },
    company_bio: {
      type: String,
    },
    writer: {
      type: Number,
      required: true,
    },
    registered_company_name: {
      type: String,
      required: true,
    },
    company_address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip_code: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    gst_number: {
      type: String,
      required: false,
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
  { timestamps: true, usePushEach: true }, // UTC format
);

projectSchema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true });

projectSchema.methods = {
  toJSON() {
    return {
      id: this._id,
      project_type: this.project_type,
      project_name: this.project_name,
      industry: this.industry,
      sub_industry: this.sub_industry,
      target_audience: this.target_audience,
      project_purpose: this.project_purpose,
      status: this.status,
      content_title: this.content_title,
      content_purpose: this.content_purpose,
      word_count: this.word_count,
      article_usage: this.article_usage,
      primary_keywords: this.primary_keywords,
      secondary_keywords: this.secondary_keywords,
      call_to_actions: this.call_to_actions,
      additional_instructions:
        this.additional_instructions && this.additional_instructions.length > 0
          ? this.additional_instructions.map((item) => {
              return {
                id: item.id,
                instructions: item.instructions,
                url: item.url,
                name: item.name,
              };
            })
          : [],
      conent_language: this.conent_language,
      content_intent: this.content_intent,
      content_perpective: this.content_perpective,
      content_tone: this.content_tone,
      outline_structure:
        this.outline_structure && this.outline_structure.length > 0
          ? this.outline_structure.map((item) => {
              return {
                id: item.id,
                instructions: item.instructions,
                url: item.url,
                name: item.name,
              };
            })
          : [],
      meta_description: this.meta_description,
      overall_instructions:
        this.overall_instructions && this.overall_instructions.length > 0
          ? this.overall_instructions.map((item) => {
              return {
                id: item.id,
                instructions: item.instructions,
                url: item.url,
                name: item.name,
              };
            })
          : [],
      company_name: this.company_name,
      company_primary_industry: this.company_primary_industry,
      company_bio: this.company_bio,
      writer: this.writer,
      registered_company_name: this.registered_company_name,
      company_address: this.company_address,
      country: this.country,
      zip_code: this.zip_code,
      state: this.state,
      gst_number: this.gst_number,
    };
  },
};
module.exports = mongoose.model('project', projectSchema);
