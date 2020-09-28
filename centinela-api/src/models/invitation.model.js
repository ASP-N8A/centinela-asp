const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

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
    default: 'developer',
  },
});

invitationSchema.plugin(toJSON);
invitationSchema.plugin(paginate);

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
