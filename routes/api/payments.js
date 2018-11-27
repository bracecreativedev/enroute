const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// import models
const Payment = require('../../models/Payment');

// @route   GET api/payments/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Payment route works' }));

// @route   POST api/payments
// @desc    Create a new payment
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newPayment = new Payment({
      location: req.body.location,
      user: req.user.id,
      bookingDates: req.body.bookingDates,
      price: req.body.price
    });

    newPayment.save().then(payment => res.json(payment));
  }
);

// @route   GET api/payment/:id
// @desc    Get a payment from ID
// @access  Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Payment.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('location', ['name'])
      .then(payment => {
        // check that logged in user is owner of payment
        if (payment.user._id == req.user.id) {
          return res.json(payment);
        } else {
          return res.status(401).send('Unauthorized');
        }
      });
  }
);

// @route   GET api/payments/
// @desc    Get current users payments
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Payment.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('location', ['name'])
      .then(payments => res.json(payments));
  }
);

module.exports = router;
