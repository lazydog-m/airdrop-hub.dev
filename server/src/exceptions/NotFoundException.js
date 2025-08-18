const { HttpStatus, HttpStatusCode } = require('../enums');

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.status = HttpStatus.NOT_FOUND;
    this.errorStatusCode = HttpStatusCode.NOT_FOUND;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = NotFoundException;
