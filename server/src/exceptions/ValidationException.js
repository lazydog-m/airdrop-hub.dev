const { HttpStatus, HttpStatusCode } = require('../enums');

class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.status = HttpStatus.VALIDATION;
    this.errorStatusCode = HttpStatusCode.VALIDATION;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ValidationException;
