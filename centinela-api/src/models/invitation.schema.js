const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { roles, DEVELOPER_ROLE } = require('../config/roles');

const status = ['pending', 'accepted'];

const invitationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  role: {
    type: String,
    enum: roles,
    default: DEVELOPER_ROLE,
  },
  status: {
    type: String,
    enum: status,
    default: status[0],
  },
});

invitationSchema.plugin(toJSON);
invitationSchema.plugin(paginate);

module.exports = invitationSchema;
