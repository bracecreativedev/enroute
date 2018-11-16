const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');

// Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   GET api/auth/test
// @desc    Tests auth route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Auth Route Works' }));

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check the validation for erros
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check if user exists
  User.findOne({
    email: validator.normalizeEmail(req.body.email)
  }).then(user => {
    if (user) {
      // if user exists, send 400 error
      errors.email = 'User with this email already exists.';
      return res.status(400).json(errors);
    } else {
      // create new user
      const { email, password, name } = req.body;
      const newUser = new User({
        email: validator.normalizeEmail(email),
        name,
        password
      });

      // encrypt the password using bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          // turn the users password into hash
          newUser.password = hash;

          // send new user to database through mongoose
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/auth/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation for any errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = validator.normalizeEmail(req.body.email);
  const { password } = req.body;

  // find use by email
  User.findOne({ email }).then(user => {
    // check if username exists
    if (!user) {
      return res.status(400).json({ email: 'Email not found' });
    }

    // TODO: check if user has confirmed their email address
    // if (!user.confirmed) {
    //   return res
    //     .status(400)
    //     .json({ email: 'Email address has not been confirmed' });
    // }

    // check password matches password in database
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // passwords matched and are correct

        // create JWT payload
        const { id, name, email } = user;

        const payload = {
          id,
          name,
          email
        };

        // sign JsonWebToken
        jwt.sign(payload, keys.key, { expiresIn: '7d' }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        });
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
