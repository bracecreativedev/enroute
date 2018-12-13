const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripe);
const moment = require('moment');

// load required models
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const Location = require('../../models/Location');

router.post('/charge', async (req, res) => {
  const token = req.body.token;

  // TODO: send location id and then do a DB look up to get the price!
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
      bookingDate: req.body.bookingDate,
      price: req.body.price,
      paymentRef: req.body.paymentRef
    });

    newBooking.save().then(booking => res.json(booking));
  }
);

// @route   GET api/bookings/:id
// @desc    Get a booking from ID
// @access  Private
router.get(
  '/booking/:id',
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
    let pageOptions = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    Booking.find({ user: req.user.id })
      .sort({ bookingDate: 1 })
      .populate('location', ['name'])
      .limit(pageOptions.limit)
      .skip(pageOptions.limit * (pageOptions.page - 1))
      .then(bookings => {
        const totalCount = bookings.length;

        res.json({
          totalBookings: totalCount,
          page: pageOptions.page,
          totalPages: Math.ceil(totalCount / pageOptions.limit),
          limit: pageOptions.limit,
          docs: bookings
        });
      });
  }
);

// @route   GET api/bookings/upcoming
// @desc    Get current users *upcoming* bookings
// @access  Private
router.get(
  '/upcoming',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let pageOptions = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Booking.find({ user: req.user.id, bookingDate: { $gte: today } })
      .sort({ bookingDate: 1 })
      .populate('location', ['name'])
      .limit(pageOptions.limit)
      .skip(pageOptions.limit * (pageOptions.page - 1))
      .then(bookings => {
        const totalCount = bookings.length;

        res.json({
          totalBookings: totalCount,
          page: pageOptions.page,
          totalPages: Math.ceil(totalCount / pageOptions.limit),
          limit: pageOptions.limit,
          docs: bookings
        });
      });
  }
);

// @route   GET api/bookings/past
// @desc    Get current users *past* bookings
// @access  Private
router.get(
  '/past',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let pageOptions = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Booking.find({ user: req.user.id, bookingDate: { $lt: today } })
      .sort({ bookingDate: -1 })
      .populate('location', ['name'])
      .limit(pageOptions.limit)
      .skip(pageOptions.limit * (pageOptions.page - 1))
      .then(bookings => {
        const totalCount = bookings.length;

        res.json({
          totalBookings: totalCount,
          page: pageOptions.page,
          totalPages: Math.ceil(totalCount / pageOptions.limit),
          limit: pageOptions.limit,
          docs: bookings
        });
      });
  }
);

// @route   GET api/bookings/availability/:locationID
// @desc    Check the availability of a location
// @access  Public
router.get('/availability/:locationID', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  Booking.find({
    location: req.params.locationID,
    bookingDate: { $gte: today }
  }).then(bookings => {
    // create a set of unique dates
    let uniqueSet = new Set();

    // map bookings and add unique dates to set
    bookings.map(booking => {
      const { bookingDate } = booking;
      // turn to string and add to sets
      uniqueSet.add(moment(bookingDate).format('MM/DD/YYYY'));
    });

    // create an array of unique dates
    let uniqueDates = [...uniqueSet];

    // initiate array for storing fully booked dates
    let fullyBookedDates = [];

    // map through each unique date
    const requests = uniqueDates.map(uniqueDate => {
      return Booking.find({ bookingDate: uniqueDate })
        .populate('location', ['spaces'])
        .then(total => {
          // if the total number of bookings exceeds the spaces total,#
          // add to fully booked array
          if (total.length >= total[0].location.spaces) {
            fullyBookedDates.push(new Date(uniqueDate));
          }
        });
    });

    Promise.all(requests).then(() =>
      res.json({ unavailable: fullyBookedDates })
    );
  });
});

// @route   GET api/bookings/user/availability
// @desc    Blocks out dates for the current logged in user
// @access  Private
router.get(
  '/user/availability',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Booking.find({ user: req.user.id, bookingDate: { $gte: today } })
      .sort({ bookingDate: 1 })
      .then(bookings => {
        let bookedDates = [];

        bookings.map(booking => {
          bookedDates.push(booking.bookingDate);
        });

        res.json({ unavailable: bookedDates });
      });
  }
);

module.exports = router;
