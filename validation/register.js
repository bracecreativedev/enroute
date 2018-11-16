const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // turn in to string
  data.email = !isEmpty(data.email) ? data.email : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // check if email is empty and valid
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required.';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid.';
  }

  // check if name is empty
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required.';
  }

  // check if password is empty or long enough
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required.';
  } else if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  // check if password2 is empty or does not match
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required.';
  } else if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
