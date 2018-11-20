const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// import location model
const User = require('../../models/User');
const Location = require('../../models/Location');

// import validation
const validateLocationInput = require('../../validation/location');

// @route   GET api/location/test
// @desc    Tests auth route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Location route works' }));

// @route   POST api/location/new
// @desc    Create a new location
// @access  Private
router.post(
  '/new',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // TODO: create and put in same request (similar to a new profile)
    const { errors, isValid } = validateLocationInput(req.body);

    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      // check validation for arrors
      if (!isValid) {
        return res.status(400).json(errors);
      }

      // create new location
      const newLocation = new Location({
        name: req.body.name,
        location: {
          street: req.body.street,
          postcode: req.body.postcode,
          long: req.body.long,
          lat: req.body.lat
        }
      });

      newLocation.save().then(location => res.json(location));
    }
  }
);

// @route   GET api/location/:id
// @desc    Get a location by ID
// @access  Public
router.get('/:id', (req, res) => {
  Location.findById(req.params.id)
    .then(location => res.json(location))
    .catch(err => res.status(404).json({ location: 'No location found' }));
});

// @route   GET api/location/
// @desc    Returns all locations
// @access  Public
router.get('/', (req, res) => {
  Location.find()
    .sort({ date: -1 })
    .then(locations => res.json(locations));
});

module.exports = router;
