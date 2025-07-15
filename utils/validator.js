const validator = require('validator');
// Validation helper functions
const validatePassword = password => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push(
      'Password must contain at least one special character (@$!%*?&)'
    );
  }

  return errors;
};

const validateInput = (username, email, password) => {
  const errors = [];

  // Username validation
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username && username.length > 30) {
    errors.push('Username must be less than 30 characters');
  }

  if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  // Email validation
  const emailError = emailValidator(email);
  if (emailError) {
    errors.push(emailError);
  }

  // Password validation
  const passwordErrors = validatePassword(password);
  errors.push(...passwordErrors);

  return errors;
};

const emailValidator = email => {
  if (!email || !validator.isEmail(email)) {
    return 'Please provide a valid email address';
  }

  return null;
};

const IdValidator = id => {
  let errorMsg = true;
  if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
    errorMsg = false;
  }

  return errorMsg;
};

module.exports = {
  validatePassword,
  validateInput,
  emailValidator,
  IdValidator
};
