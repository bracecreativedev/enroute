const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

// Bring in API Routes
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const locations = require('./routes/api/locations');
const bookings = require('./routes/api/bookings');
const payments = require('./routes/api/payments');
const admin = require('./routes/api/admin');

// Initiate express app
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// redirect to https
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else next();
  });
}

// DB config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use routes
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/locations', locations);
app.use('/api/bookings', bookings);
app.use('/api/payments', payments);
app.use('/api/admin', admin);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// For heroku use env.port, or locally run on port 5000
const port = process.env.PORT || 5000;

// Console log if server is running
app.listen(port, () => console.log(`Server running on port ${port}`));
