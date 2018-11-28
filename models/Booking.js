const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const BookingSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: 'locations'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  paymentRef: {
    type: Schema.Types.ObjectId,
    ref: 'payments'
  },
  bookingDate: {
    type: Date
  },
  price: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Booking = mongoose.model('bookings', BookingSchema);
