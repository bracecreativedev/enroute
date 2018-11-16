const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Bring in API Routes
const auth = require('./routes/api/auth');

// Initiate express app
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Use routes
app.use('/api/auth', auth);

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
