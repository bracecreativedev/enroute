const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const LocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    street: {
      type: String,
      required: true
    },
    postcode: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }
  // spaces: {
  //   type: Number
  // },
  // enrouteRoads: {
  //   type: String
  // },
  // facilities: {
  //   type: String
  // },
  // times: {
  //   type: String
  // },
  // otherInfo: {
  //   type: String
  // }
});

module.exports = Location = mongoose.model('locations', LocationSchema);
