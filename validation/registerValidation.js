import validator from 'validator';
import isEmpty from './isEmpty.js';

const validateRegisterInput = data => {
  let errors = {};

  // check email field
  if (isEmpty(data.email)) {
    errors.email = 'Email field can not be empty';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is not the right format';
  }

  // check name field
  if (isEmpty(data.name)) {
    errors.name = 'Name field can not be empty';
  } else if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters long';
  }

  // check password field
  if (isEmpty(data.password)) {
    errors.password = 'Password field can not be empty';
  } else if (!validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = 'Password must be between 6 and 150 characters long';
  }

  // check confirm password field
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field can not be empty';
  } else if (!validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'The 2 passwords do not match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateRegisterInput;
