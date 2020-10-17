const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const issueSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'No description',
    },
    severity: {
      type: Number,
      validate(value) {
        if (![1, 2, 3, 4].includes(value)) {
          throw new Error('Severity must be a number from 1 to 4');
        }
      },
      default: 4,
    },
    developer: {
      type: String,
    },
    status: {
      type: String,
      enum: ['open', 'close'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
issueSchema.plugin(toJSON);
issueSchema.plugin(paginate);

module.exports = issueSchema;
