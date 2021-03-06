const express = require('express');
const router = express.Router();
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

// import models
const Booking = require('../../models/Booking');
const Location = require('../../models/Location');
const User = require('../../models/User');
const Payment = require('../../models/Payment');

// @route   GET api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get(
  '/bookings',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let queryOptions = {};

      if (!isEmpty(req.query.location)) {
        queryOptions.location = req.query.location;
      }

      if (req.query.bookingDates === 'upcoming') {
        queryOptions.bookingDate = { $gte: today };
      } else if (req.query.bookingDates === 'past') {
        queryOptions.bookingDate = { $lt: today };
      }

      if (!isEmpty(req.query.user)) {
        queryOptions.user = req.query.user;
      }

      Booking.find(queryOptions)
        .sort({ date: -1 })
        .populate('location', ['name'])
        .populate('user', ['name', 'email'])
        .then(bookings => res.json(bookings))
        .catch(err => res.status(404).json({ bookings: 'No bookings found' }));
    }
  }
);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      let queryOptions = {};

      if (!isEmpty(req.query.name)) {
        queryOptions.name = { $regex: req.query.name, $options: 'i' };
      }

      if (!isEmpty(req.query.email)) {
        queryOptions.email = { $regex: req.query.email, $options: 'i' };
      }

      if (!isEmpty(req.query.id)) {
        queryOptions._id = req.query.id;
      }

      User.find(queryOptions)
        .sort({ date: -1 })
        .select('-password')
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ users: 'No users found' }));
    }
  }
);

// @route   GET api/admin/locations
// @desc    Get all locations
// @access  Admin
router.get(
  '/locations',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      Location.find()
        .sort({ name: 1 })
        .then(locations => res.json(locations));
    }
  }
);

// @route   GET api/admin/location/:id
// @desc    Get location by ID
// @access  Admin
router.get(
  '/location/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      Location.findById(req.params.id).then(location => res.json(location));
    }
  }
);

// @route   POST api/admin/location
// @desc    Edit location
// @access  Admin
router.post(
  '/location/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      Location.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
        location => {
          res.json(location);
        }
      );
    }
  }
);

// @route   POST api/admin/new-location
// @desc    Create a new location
// @access  Admin
router.post(
  '/new-location',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      const newLocation = new Location({
        name: req.body.name,
        price: req.body.price,
        spaces: req.body.spaces,
        roads: req.body.roads,
        accessTimes: req.body.accessTimes,
        location: {
          street: req.body.location.street,
          postcode: req.body.location.postcode,
          lat: req.body.location.lat,
          lng: req.body.location.lng
        },
        images: req.body.images,
        active: req.body.active
      });

      newLocation.save().then(location => res.json(location));
    }
  }
);

// @route   GET api/admin/payments
// @desc    Get all payments
// @access  Admin
router.get(
  '/payments',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      Payment.find()
        .populate('user', ['name', 'email'])
        .populate('location', ['name'])
        .then(payments => res.json(payments));
    }
  }
);

module.exports = router;
