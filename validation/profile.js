const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  // data.status = !isEmpty(data.status) ? data.status : '';
  // data.skills = !isEmpty(data.skills) ? data.skills : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.reg = !isEmpty(data.reg) ? data.reg : '';
  data.make = !isEmpty(data.make) ? data.make : '';
  data.model = !isEmpty(data.model) ? data.model : '';
  data.colour = !isEmpty(data.colour) ? data.colour : '';

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Phone number is required.';
  }

  if (Validator.isEmpty(data.reg)) {
    errors.reg = 'Vehicle registration is required.';
  }

  if (Validator.isEmpty(data.make)) {
    errors.make = 'Vehicle make is required.';
  }
  if (Validator.isEmpty(data.model)) {
    errors.model = 'Vehicle model is required.';
  }

  if (Validator.isEmpty(data.colour)) {
    errors.colour = 'Vehicle colour is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
