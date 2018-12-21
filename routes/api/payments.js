const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripe);
const moment = require('moment');
const nodemailer = require('nodemailer');
const transporter = require('../../config/nodemailer');

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
                        bookingDate: singleDate,
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

                    transporter.sendMail({
                      to: 'info@enrouteparking.com',
                      subject: `New Booking - #${payment._id}`,
                      html: `
                      <p>New payment on En Route</p>
                      <p><a href="https://app.enrouteparking.com/confirmation/${
                        payment._id
                      }">View Payment Online</a></p>
                      `
                    });

                    // step 6: send confirmation email
                    User.findById(req.user.id).then(user => {
                      transporter
                        .sendMail({
                          to: user.email,
                          subject: 'Payment Confirmation - En Route Parking',
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
                                                      Thanks for using En Route Parking! Your booking has
                                                      been successful. Please click this link to view your
                                                      booking and payment details…
                                                    </p>
                                                  </td>
                                                </tr>

                                                <tr>
                                                  <td>
                                                    <table class="pricing-table" style="width: 100%;">
                                                      <tr>
                                                        <th style="color: #96c236;">LOCATION</th>
                                                        <th style="color: #96c236;"># OF DATES</th>
                                                        <th style="color: #96c236;">VEHICLE REG</th>
                                                        <th style="color: #96c236;">TOTAL COST</th>
                                                      </tr>
                                                      <tr>
                                                        <td style="text-align: center; width: 25%;">
                                                          ${location.name}
                                                        </td>
                                                        <td style="text-align: center; width: 25%;">
                                                          ${
                                                            payment.bookingDates
                                                              .length
                                                          }
                                                        </td>
                                                        <td style="text-align: center; width: 25%;">
                                                          ${payment.vehicle.reg}
                                                        </td>
                                                        <td style="text-align: center; width: 25%;">
                                                          £${(
                                                            payment.price / 100
                                                          ).toFixed(2)}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>

                                                <tr>
                                                  <td>
                                                    <p style="margin: 20px 0;">
                                                      <a
                                                        href="https://app.enrouteparking.com/confirmation/${
                                                          payment._id
                                                        }"
                                                        style="color: #96c236;"
                                                      >
                                                        View your payment confirmation online</a
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

                                  .pricing-table {
                                    border-collapse: collapse;
                                  }

                                  .pricing-table,
                                  .pricing-table th,
                                  .pricing-table td {
                                    border: 1px solid #8f8f8f;
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
                        .then(email => console.log('Payment Email sent'))
                        .catch(err => {
                          console.log(
                            'Error sending payment email, user has been auto-confirmed.'
                          );
                        });
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
        if (payment.user._id == req.user.id || req.user.admin) {
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
