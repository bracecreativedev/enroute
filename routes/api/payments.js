const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripe);
const moment = require('moment');

// import models
const Payment = require('../../models/Payment');
const Location = require('../../models/Location');
const Booking = require('../../models/Booking');

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

// @route   POST api/payments/new/:locationID
// @desc    Create a new payment for certain location
// @access  Private
router.post(
  '/new/:locationID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { token, bookingDates } = req.body;
    const { locationID } = req.params;

    // step 1: find the profile and location
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Location.findById(locationID)
          .then(location => {
            // step 2: create new payment object
            const newPayment = new Payment({
              location: location._id,
              user: req.user.id,
              bookingDates: bookingDates,
              price: location.price * bookingDates.length,
              vehicle: {
                reg: profile.vehicle.reg,
                make: profile.vehicle.make,
                model: profile.vehicle.model,
                colour: profile.vehicle.colour
              }
            });

            // step 3: create stripe charge
            stripe.charges.create(
              {
                amount: location.price * bookingDates.length,
                currency: 'gbp',
                source: token,
                metadata: {
                  payment_id: newPayment.id,
                  user_id: req.user.id,
                  user_email: req.user.email
                }
              },
              function(err, charge) {
                if (err)
                  return res.status(400).send({ charge: 'Error on charge' });
                // step 4: if no errors and charge successful save new payment to db
                newPayment
                  .save()
                  .then(payment => {
                    // step 5: create new bookings
                    payment.bookingDates.map(singleDate => {
                      const newBooking = new Booking({
                        location: location._id,
                        user: req.user.id,
                        bookingDate: moment(
                          singleDate,
                          'DD-MM-YY'
                        ).toISOString(),
                        price: location.price,
                        vehicle: {
                          reg: profile.vehicle.reg,
                          make: profile.vehicle.make,
                          model: profile.vehicle.model,
                          colour: profile.vehicle.colour
                        },
                        paymentRef: payment._id
                      }).save();
                    });
                    return res.json(payment);
                  })
                  .catch(err =>
                    res
                      .status(400)
                      .send({ payment: 'Error with creating new payment' })
                  );
              }
            );
          })
          .catch(err =>
            res.status(404).send({ location: 'No location found' })
          );
      })
      .catch(err =>
        res.status(404).send(profile => 'No user profile found for payment')
      );
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
      .populate('location', ['name', 'location'])
      .then(payment => {
        // check that logged in user is owner of payment
        if (payment.user._id == req.user.id) {
          return res.json(payment);
        } else {
          return res.status(401).send('Unauthorized');
        }
      })
      .catch(err => {
        return res.status(404).send({ notfound: 'No payment found' });
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
