const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const keySchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
keySchema.plugin(toJSON);

/**
 * @typedef Key
 */
const Key = mongoose.model('Key', keySchema);

module.exports = Key;
