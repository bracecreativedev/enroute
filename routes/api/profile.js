const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require('axios');
const keys = require('../../config/keys');
const isEmpty = require('../../validation/is-empty');

// Load Validation
const validateProfileInput = require('../../validation/profile');

// load required models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check Validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.phone) profileFields.phone = req.body.phone;
    if (req.body.occupation) profileFields.occupation = req.body.occupation;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.dob) profileFields.dob = req.body.dob;
    // vehicle info
    profileFields.vehicle = {};
    if (req.body.reg) profileFields.vehicle.reg = req.body.reg;
    if (req.body.make) profileFields.vehicle.make = req.body.make;
    if (req.body.model) profileFields.vehicle.model = req.body.model;
    if (req.body.colour) profileFields.vehicle.colour = req.body.colour;
    // address
    profileFields.address = {};
    if (req.body.street) profileFields.address.street = req.body.street;
    if (req.body.postcode) profileFields.address.postcode = req.body.postcode;
    // company
    profileFields.company = {};
    if (req.body.companyName) profileFields.company.name = req.body.companyName;
    if (req.body.companyPostcode)
      profileFields.company.postcode = req.body.companyPostcode;

    // get geocode location of users address
    if (!isEmpty(req.body.postcode)) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${
            req.body.postcode
          }&key=${keys.geocode}`
        )
        .then(geocode => {
          // if empty, set profile fields to nothing
          if (isEmpty(geocode.data.results)) {
            profileFields.address.lat = '';
            profileFields.address.lng = '';
          } else {
            const location = geocode.data.results[0].geometry.location;

            profileFields.address.lat = location.lat;
            profileFields.address.lng = location.lng;
          }

          if (!isEmpty(req.body.companyPostcode)) {
            axios
              .get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${
                  req.body.companyPostcode
                }&key=${keys.geocode}`
              )
              .then(office => {
                // if empty, set profile fields to nothing
                if (isEmpty(office.data.results)) {
                  profileFields.company.lat = '';
                  profileFields.company.lng = '';
                } else {
                  const officeLocation =
                    office.data.results[0].geometry.location;

                  profileFields.company.lat = officeLocation.lat;
                  profileFields.company.lng = officeLocation.lng;
                }

                Profile.findOne({ user: req.user.id }).then(profile => {
                  if (profile) {
                    // update
                    Profile.findOneAndUpdate(
                      { user: req.user.id },
                      { $set: profileFields, lastUpdated: new Date() },
                      { new: true }
                    ).then(profile => res.json(profile));
                  } else {
                    // create new profile
                    new Profile(profileFields)
                      .save()
                      .then(profile => res.json(profile));
                  }
                });
              });
          } else {
            Profile.findOne({ user: req.user.id }).then(profile => {
              if (profile) {
                // update
                Profile.findOneAndUpdate(
                  { user: req.user.id },
                  { $set: profileFields, lastUpdated: new Date() },
                  { new: true }
                ).then(profile => res.json(profile));
              } else {
                // create new profile
                new Profile(profileFields)
                  .save()
                  .then(profile => res.json(profile));
              }
            });
          }
        });
    } else if (
      isEmpty(req.body.postcode) &&
      !isEmpty(req.body.companyPostcode)
    ) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${
            req.body.companyPostcode
          }&key=${keys.geocode}`
        )
        .then(office => {
          // if empty, set profile fields to nothing
          if (isEmpty(office.data.results)) {
            profileFields.company.lat = '';
            profileFields.company.lng = '';
          } else {
            const officeLocation = office.data.results[0].geometry.location;

            profileFields.company.lat = officeLocation.lat;
            profileFields.company.lng = officeLocation.lng;
          }

          Profile.findOne({ user: req.user.id }).then(profile => {
            if (profile) {
              // update
              Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields, lastUpdated: new Date() },
                { new: true }
              ).then(profile => res.json(profile));
            } else {
              // create new profile
              new Profile(profileFields)
                .save()
                .then(profile => res.json(profile));
            }
          });
        });
    } else {
      Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
          // update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields, lastUpdated: new Date() },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          // create new profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        }
      });
    }
  }
);

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'email'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(errr => res.status(404).json(err));
  }
);

// @route   GET api/profile/geocode
// @desc    Test google maps geocoding
// @access  Private
router.get('/geocode/:address', (req, res) => {
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${
        req.params.address
      }&key=${keys.geocode}`
    )
    .then(geocode => {
      if (isEmpty(geocode.data.results)) {
        res.json({ results: 'No results' });
      } else {
        const location = geocode.data.results[0].geometry.location;
        res.json(location);
      }
    });
});

module.exports = router;
