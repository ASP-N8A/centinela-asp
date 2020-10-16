const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    requiered: true,
    trim: true,
  },
  users: {
    type: [String],
    required: true,
    unique: true,
  },
});

organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

/**
 * Check if organization name is taken
 * @param {String} name - The organization name
 * @returns {Promise<boolean>}
 */
organizationSchema.statics.isNameTaken = async function (name) {
  const organization = await this.findOne({ name });
  return !!organization;
};

/**
 * @typedef Organization
 */
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
