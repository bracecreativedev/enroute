const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.reg = !isEmpty(data.reg) ? data.reg : '';

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Phone number is required.';
  }

  if (Validator.isEmpty(data.reg)) {
    errors.reg = 'Vehicle registration is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
