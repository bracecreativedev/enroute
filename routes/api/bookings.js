const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripe);

// load required models
const Booking = require('../../models/Booking');
const User = require('../../models/User');

router.post('/charge', async (req, res) => {
  const token = req.body.token;

  stripe.charges.create(
    {
      amount: req.body.price,
      currency: 'gbp',
      source: token,
      description: req.body.description
    },
    function(err, charge) {
      //
    }
  );
});

// @route   GET api/bookings/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Booking route works' }));

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newBooking = new Booking({
      location: req.body.location,
      user: req.user.id,
      bookingDate: req.body.bookingDate
    });

    newBooking.save().then(booking => res.json(booking));
  }
);

// @route   GET api/bookings/:id
// @desc    Get a booking from ID
// @access  Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Booking.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('location', ['name'])
      .then(booking => {
        if (booking.user._id == req.user.id) {
          return res.json(booking);
        } else {
          return res.status(401).send('Unauthorized');
        }
      });
  }
);

// @route   GET api/bookings/
// @desc    Get current users bookings
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Booking.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('location', ['name'])
      .then(bookings => res.json(bookings));
  }
);

module.exports = router;
