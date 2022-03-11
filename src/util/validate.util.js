const { validationResult } = require('express-validator');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(validations);

  if (errors.isEmpty()) {
    next();
  } else {
    res.status(400).json({
      errors: errors.array(),
      message: errors.array()[0].msg,
    });
  }
};

module.exports = validate;
