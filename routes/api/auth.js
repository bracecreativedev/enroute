const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('../../config/nodemailer');
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

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
      html: `Test Email`
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
                  const url = `https://app.enrouteparking.com/confirm-email/${emailToken}`;

                  transporter.sendMail({
                    to: 'info@enrouteparking.com',
                    subject: `New User Registration - ${user.name}`,
                    html: `New user registration:
                      <br/><br/>
                      <strong>Name:</strong> ${user.name} <br/>
                      <strong>Email:</strong> ${user.email} <br/>
                      <strong>ID:</strong> ${user.id}`
                  });

                  transporter
                    .sendMail({
                      to: user.email,
                      subject:
                        'Confirm Your Email Address for En Route Parking',
                      html: `
                      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                      <html xmlns="http://www.w3.org/1999/xhtml">
                        <head>
                          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        </head>
                        <body
                          style="width: 100% !important; -webkit-text-size-adjust: none; margin: 0; padding: 0;"
                        >
                          <center>
                            <table
                              id="backgroundTable"
                              style="border-spacing: 0; border-collapse: collapse; font-family: proxima-nova, 'helvetica neue', helvetica, arial, geneva, sans-serif; height: 100% !important; width: 100% !important; color: #4c4c4c; font-size: 15px; line-height: 150%; background: #ffffff; margin: 0; padding: 0; border: 0;"
                            >
                              <tr style="vertical-align: top; padding: 0;">
                                <td
                                  align="center"
                                  valign="top"
                                  style="vertical-align: top; padding: 0;"
                                >
                                  <table
                                    id="templateContainer"
                                    style="border-spacing: 0; border-collapse: collapse; font-family: proxima-nova, 'helvetica neue', helvetica, arial, geneva, sans-serif; height: 100%; width: 600px; color: #4c4c4c; font-size: 15px; line-height: 150%; background: #ffffff; margin: 40px 0; padding: 0; border: 0;"
                                  >
                                    <tr style="vertical-align: top; padding: 0;">
                                      <td
                                        class="templateContainerPadding"
                                        align="center"
                                        valign="top"
                                        style="vertical-align: top; padding: 0 40px;"
                                      >
                                        <table
                                          id="templateContent"
                                          style="border-spacing: 0; border-collapse: collapse; font-family: proxima-nova, 'helvetica neue', helvetica, arial, geneva, sans-serif; height: 100%; width: 100%; background: #ffffff; margin: 0; padding: 0; border: 0;"
                                        >
                                          <tr style="vertical-align: top; padding: 0;">
                                            <td
                                              style="vertical-align: top; text-align: left; padding: 0;"
                                              align="left"
                                              valign="top"
                                            >
                                              <h1
                                                id="logo"
                                                style="color: #96c236; display: block; font-family: hybrea, proxima-nova, 'helvetica neue', helvetica, arial, geneva, sans-serif; font-size: 32px; font-weight: 200; text-align: left; margin: 0 0 10px;"
                                                align="left"
                                              >
                                                <img
                                                  src="https://app.enrouteparking.com/static/media/logo.35b7ffcd.png"
                                                  alt="En Route Parking"
                                                  width="164"
                                                  height="80"
                                                  style="outline: none; text-decoration: none; border: 0;"
                                                />
                                              </h1>
              
                                              <p style="margin-bottom: 20px; margin-top: 0px;">
                                                Thanks for signing up to En Route Parking! Please
                                                click the link below to activate your account...
                                              </p>
              
                                              <p style="margin: 20px 0;">
                                                <a
                                                  href="${url}"
                                                  style="color: #96c236;"
                                                  >Activate your account!</a
                                                >
                                              </p>
              
                                              <p style="margin: 20px 0;">Thanks,</p>
              
                                              <p style="margin: 20px 0;">
                                                En Route Parking<br />
                                                <a
                                                  href="https://enrouteparking.com"
                                                  style="color: #96c236;"
                                                  >www.enrouteparking.com</a
                                                >
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr style="vertical-align: top; padding: 0;">
                                      <td
                                        class="templateContainerPadding"
                                        align="center"
                                        valign="top"
                                        style="vertical-align: top; padding: 0 40px;"
                                      >
                                        <table
                                          id="footerContent"
                                          style="border-spacing: 0; border-collapse: collapse; font-family: proxima-nova, 'helvetica neue', helvetica, arial, geneva, sans-serif; height: 100%; width: 100%; border-top-style: solid; border-top-color: #ebeaef; color: #999999; font-size: 12px; background: #ffffff; margin: 0; padding: 0; border-width: 1px 0 0;"
                                        >
                                          <tr style="vertical-align: top; padding: 0;">
                                            <td
                                              valign="top"
                                              style="vertical-align: top; text-align: left; padding: 0;"
                                              align="left"
                                            >
                                              <p style="margin: 20px 0;">
                                                <a
                                                  href="https://www.facebook.com/enrouteparking/"
                                                  style="text-decoration: none;"
                                                >
                                                  <img
                                                    src="https://www.enrouteparking.com/wp-content/uploads/2018/12/facebook-letter-logo.png"
                                                    alt="Facebook Logo"
                                                    style="width: 30px; height: 30px; text-decoration: none; margin-right: 10px;"
                                                    width="30"
                                                    height="30"
                                                  />
                                                </a>
              
                                                <a
                                                  href="https://twitter.com/RouteParking"
                                                  style="text-decoration: none;"
                                                >
                                                  <img
                                                    src="https://www.enrouteparking.com/wp-content/uploads/2018/12/twitter-logo-silhouette.png"
                                                    alt="Twitter Logo"
                                                    style="width: 30px; height: 30px; text-decoration: none; margin-right: 10px;"
                                                    width="30"
                                                    height="30"
                                                  />
                                                </a>
              
                                                <a
                                                  href="https://www.linkedin.com/company/enrouteparking/"
                                                  style="text-decoration: none;"
                                                >
                                                  <img
                                                    src="https://www.enrouteparking.com/wp-content/uploads/2018/12/linked-in-logo.png"
                                                    alt="LinkedIn Logo"
                                                    style="width: 30px; height: 30px; text-decoration: none; margin-right: 10px;"
                                                    width="30"
                                                    height="30"
                                                  />
                                                </a>
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </center>
              
                          <style type="text/css">
                            body {
                              width: 100% !important;
                            }
                            .ReadMsgBody {
                              width: 100%;
                            }
                            .ExternalClass {
                              width: 100%;
                            }
                            body {
                              -webkit-text-size-adjust: none;
                            }
                            body {
                              margin: 0;
                              padding: 0;
                            }
                            img {
                              border: 0;
                              outline: none;
                              text-decoration: none;
                            }
                            #backgroundTable {
                              height: 100% !important;
                              margin: 0;
                              padding: 0;
                              width: 100% !important;
                            }
                            #backgroundTable {
                              color: #4c4c4c;
                              background-color: #ffffff;
                              font-family: proxima-nova, 'helvetica neue', helvetica, arial, geneva,
                                sans-serif;
                              font-size: 15px;
                              line-height: 150%;
                            }
                            @media (max-width: 540px) {
                              #templateContainer {
                                width: 100% !important;
                              }
                              #templateContainer .templateContainerPadding {
                                padding: 0 5% !important;
                              }
                            }
                          </style>
                        </body>
                      </html>
                      `
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

// @route   POST api/auth/forgotten-password
// @desc    Send a reset password email
// @access  Public
router.post('/forgotten-password', (req, res) => {
  const { email } = req.body;

  User.findOne({ email: email })
    .then(user => {
      //
      jwt.sign(
        {
          password: user.password
        },
        keys.EMAIL_SECRET,
        {},
        (err, resetToken) => {
          const url = `https://shielded-mesa-88850.herokuapp.com/reset-password/${resetToken}`;

          transporter
            .sendMail({
              to: user.email,
              subject: 'Reset your En Route Parking password!',
              html: `Please click this link to reset your En Route Parking account: <a href="${url}">${url}</a>`
            })
            .then(email => console.log('Reset password email sent'))
            .catch(err => {
              console.log('Error sending reset password email.');
            });
        }
      );
    })
    .catch(err => res.status(404).json({ error: 'No user found!' }));
});

// @route   POST api/auth/forgotten-password
// @desc    Send a reset password email
// @access  Public
router.post('/reset-password/:token', (req, res) => {
  const jwtUser = jwt.verify(req.params.token, keys.EMAIL_SECRET);

  const { newPassword, confirmPassword } = req.body;

  if (
    isEmpty(newPassword) ||
    isEmpty(confirmPassword) ||
    newPassword !== confirmPassword
  ) {
    return res.status(400).json({ newPassword: 'Issue with new passwords' });
  } else if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ newPassword: 'New password must be more than 6 characters' });
  }

  User.findOne({ password: jwtUser.password }).then(user => {
    if (!user) {
      console.log('Password reset hash rejected');
      return res.status(404).json({ user: 'No user found' });
    }

    const { newPassword } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
        const hashedPassword = hash;

        User.findByIdAndUpdate(
          user.id,
          { password: hashedPassword },
          { new: true }
        )
          .select('-password')
          .then(newUser => {
            res.json(newUser);
            console.log(newUser);
          });
      });
    });
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
        const { id, name, email, admin } = user;

        const payload = {
          id,
          name,
          email,
          admin
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

// @route   POST api/auth/update-email
// @desc    Allow a user to update their email address
// @access  Public
router.post(
  '/update-email',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (isEmpty(req.body.email) || !validator.isEmail(req.body.email)) {
      return res
        .status(400)
        .send({ email: 'This is not a valid email address' });
    }

    User.findByIdAndUpdate(
      req.user.id,
      { email: validator.normalizeEmail(req.body.email) },
      { new: true }
    )
      .select('-password')
      .then(user => {
        // create JWT payload
        const { id, name, email, admin } = user;

        const payload = {
          id,
          name,
          email,
          admin
        };

        // sign JsonWebToken
        jwt.sign(payload, keys.key, { expiresIn: '7d' }, (err, token) => {
          res.json({
            success: true,
            email: user.email,
            token: 'Bearer ' + token
          });
        });
      });
  }
);

// @route   POST api/auth/update-password
// @desc    Allow the user to change their password
// @access  Public
router.post(
  '/update-password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // TODO ADD FURTHER VALIDATION
    if (isEmpty(req.body.newPassword)) {
      return res
        .status(400)
        .send({ newPassword: 'New password field cannot be empty' });
    } else if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .send({ confirmPassword: 'The new passwords must match' });
    } else if (req.body.newPassword.length < 6) {
      return res.status(400).send({
        newPassword: 'New password must be more than 6 characters long.'
      });
    }

    User.findById(req.user.id).then(user => {
      const { oldPassword } = req.body;

      bcrypt.compare(oldPassword, user.password).then(isMatch => {
        if (!isMatch) {
          return res
            .status(400)
            .json({ oldPassword: 'Your old password is incorrect.' });
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
              const hashedPassword = hash;

              User.findByIdAndUpdate(
                req.user.id,
                { password: hashedPassword },
                { new: true }
              )
                .select('-password')
                .then(newUser => res.json(newUser));
            });
          });
        }
      });
    });
  }
);

// @route   POST api/auth/update-password/admin/:id
// @desc    Allow the user to change their password
// @access  Public
// router.post(
//   '/update-password/admin/:id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
//         const hashedPassword = hash;

//         User.findByIdAndUpdate(
//           req.params.id,
//           { password: hashedPassword },
//           { new: true }
//         )
//           .select('-password')
//           .then(newUser => res.json(newUser));
//       });
//     });
//   }
// );

// @route   POST api/auth/update-name
// @desc    Allow the user to change their account name
// @access  Public
router.post(
  '/update-name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user.id).then(user => {
      const { newName } = req.body;

      if (isEmpty(newName)) {
        return res
          .status(400)
          .json({ newName: 'The name field cannot be empty' });
      }

      User.findByIdAndUpdate(req.user.id, { name: newName }, { new: true })
        .select('-password')
        .then(newUser => {
          // create JWT payload
          const { id, name, email, admin } = newUser;

          const payload = {
            id,
            name,
            email,
            admin
          };

          // sign JsonWebToken
          jwt.sign(payload, keys.key, { expiresIn: '7d' }, (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          });
        });
    });
  }
);

module.exports = router;
