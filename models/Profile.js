const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  phone: {
    type: String,
    required: true
  },
  vehicle: {
    reg: {
      type: String,
      required: true
    },
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    colour: {
      type: String,
      required: true
    }
  },
  address: {
    street: {
      type: String
    },
    postcode: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  company: {
    name: {
      type: String
    },
    postcode: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  occupation: {
    type: String
  },
  gender: {
    type: String
  },
  dob: {
    type: String
  },
  lastUpdated: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
