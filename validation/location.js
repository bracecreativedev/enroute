const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLocationInput(data) {
  let errors = {};

  // data.status = !isEmpty(data.status) ? data.status : '';
  // data.skills = !isEmpty(data.skills) ? data.skills : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.street = !isEmpty(data.street) ? data.street : '';
  data.postcode = !isEmpty(data.postcode) ? data.postcode : '';
  data.lng = !isEmpty(data.lng) ? data.lng : '';
  data.lat = !isEmpty(data.lat) ? data.lat : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Location name is required.';
  }

  if (Validator.isEmpty(data.street)) {
    errors.street = 'Location address is required.';
  }

  if (Validator.isEmpty(data.postcode)) {
    errors.postcode = 'Location postcode is required.';
  }
  if (Validator.isEmpty(data.lng)) {
    errors.lng = 'Location longitudinal value is required.';
  } else if (!Validator.isNumeric(data.lng)) {
    errors.lng = 'Location longitudinal value must be a number.';
  }

  if (Validator.isEmpty(data.lat)) {
    errors.lat = 'Location latitudinal value is required.';
  } else if (!Validator.isNumeric(data.lat)) {
    errors.lat = 'Location latitudinal value must be a number.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
