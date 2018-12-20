const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const LocationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  images: [
    {
      imageURL: {
        type: String
      }
    }
  ],
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
  },
  spaces: {
    type: Number
  },
  price: {
    type: Number
  },
  roads: {
    type: String
  },
  accessTimes: {
    type: String
  },
  disabledAfter: {
    type: String
  },
  disabledRange: [
    {
      disabledFrom: {
        type: String
      },
      disabledTo: {
        type: String
      }
    }
  ],
  disabledDaysOfWeek: [
    {
      dayNumber: Number
    }
  ],
  disabledSingleDays: [
    {
      date: {
        type: String
      }
    }
  ],
  active: {
    type: Boolean,
    default: true
  }
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
