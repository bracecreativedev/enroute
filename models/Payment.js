const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const PaymentSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: 'locations'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  bookingDates: [],
  price: {
    type: Number
  },
  vehicle: {
    reg: {
      type: String
    },
    make: {
      type: String
    },
    model: {
      type: String
    },
    colour: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Payment = mongoose.model('payments', PaymentSchema);
