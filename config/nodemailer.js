const nodemailer = require('nodemailer');
const keys = require('./keys');

// Nodemailer
module.exports = transporter = nodemailer.createTransport({
  host: keys.EMAIL_HOST, // Office 365 server
  port: keys.EMAIL_PORT, // secure SMTP
  secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
  auth: {
    user: keys.EMAIL_USER,
    pass: keys.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false, // don't verify certificates
    ciphers: 'SSLv3'
  }
});
