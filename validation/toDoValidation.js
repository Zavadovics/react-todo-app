import validator from 'validator';
import isEmpty from './isEmpty.js';

const validateToDoInput = data => {
  let errors = {};

  // check content field
  if (isEmpty(data.content)) {
    errors.content = 'Content field can not be empty';
  } else if (!validator.isLength(data.content, { min: 2, max: 30 })) {
    errors.content = 'Content must be between 2 and 30 characters long';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateToDoInput;
