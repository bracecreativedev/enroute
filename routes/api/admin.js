const express = require('express');
const router = express.Router();
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

// import models
const Booking = require('../../models/Booking');
const Location = require('../../models/Location');
const User = require('../../models/User');

// @route   GET api/admin/locations
// @desc    Get all locations
// @access  Public
router.get(
  '/locations',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized');
    } else {
      Location.find().then(locations => res.json(locations));
    }
  }
);

// @route   GET api/admin/bookings
// @desc    Get all bookings
// @access  Public
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
        .populate('user', ['name'])
        .then(bookings => res.json(bookings))
        .catch(err => res.status(404).json({ bookings: 'No bookings found' }));
    }
  }
);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Public
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

module.exports = router;
