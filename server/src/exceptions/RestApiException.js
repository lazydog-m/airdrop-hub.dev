const { HttpStatus, HttpStatusCode } = require('../enums');

class RestApiException extends Error {
  constructor(message) {
    super(message);
    this.status = HttpStatus.BAD_REQUEST;
    this.errorStatusCode = HttpStatusCode.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = RestApiException;
