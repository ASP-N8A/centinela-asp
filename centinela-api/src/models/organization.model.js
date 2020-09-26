const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Types } = mongoose.Schema;

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    requiered: true,
    trim: true,
  },
  issues: [
    {
      type: Types.ObjectId,
      ref: 'Issue',
    },
  ],
  users: [
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ],
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
