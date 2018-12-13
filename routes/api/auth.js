const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('../../config/nodemailer');

// Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   GET api/auth/test
// @desc    Tests auth route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Auth Route Works' }));

// @route   POST api/auth/test
// @desc    Sends a test email
// @access  Public
router.post('/email-test', (req, res) => {
  // async email
  transporter
    .sendMail({
      to: req.body.email,
      subject: 'Test Email',
      html: `This is a test email sent from the /api/auth/email-test route.`
    })
    .then(email => res.json(email))
    .catch(err => {
      res.status(400).json({ error: 'There was an error sending the email.' });
      console.log(err);
    });
});

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check the validation for errors
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
              // send confirmation email
              jwt.sign(
                {
                  id: user.id,
                  name: user.name,
                  email: user.email
                },
                keys.EMAIL_SECRET,
                {},
                (err, emailToken) => {
                  const url = `http://localhost:3000/confirm-email/${emailToken}`;

                  transporter
                    .sendMail({
                      to: user.email,
                      subject: 'Confirm Email',
                      html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
                    })
                    .then(email => console.log('Email sent'))
                    .catch(err => {
                      User.findByIdAndUpdate(
                        user.id,
                        { confirmed: true },
                        { new: true }
                      );

                      console.log(
                        'Error sending email, user has been auto-confirmed.'
                      );
                    });
                }
              );

              return res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/auth/confirmation/:token
// @desc    Confirm a user email address
// @access  Public
router.get('/confirmation/:token', (req, res) => {
  const user = jwt.verify(req.params.token, keys.EMAIL_SECRET);

  User.findByIdAndUpdate(user.id, { confirmed: true }, { new: true }).then(
    user => res.json(user)
  );
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

    // check if user has confirmed their email address
    if (!user.confirmed) {
      return res
        .status(400)
        .json({ email: 'Email address has not been confirmed' });
    }

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
