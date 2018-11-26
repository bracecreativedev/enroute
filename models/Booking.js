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
  bookingDate: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Booking = mongoose.model('bookings', BookingSchema);
