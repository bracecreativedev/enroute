// User model with schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create user schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Export model
module.exports = User = mongoose.model('users', UserSchema);
