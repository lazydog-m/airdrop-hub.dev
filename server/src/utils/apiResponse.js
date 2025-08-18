require('dotenv').config();

const { HttpStatus, HttpStatusCode, Message } = require('../enums');

const apiRes = {
  toJson: (res, data, status = HttpStatus.OK, message = Message.SUCCESS) => {
    const responseBody = {
      code: status,
      message,
      data,
    };

    return res.status(status).json(responseBody);
  },

  toError: (res, status = HttpStatus.SERVER_ERROR, errorCode = HttpStatusCode.SERVER_ERROR, message = Message.ERROR, stack) => {

    const errorResponseBody = {
      code: status,
      error_code: errorCode,
      message,
      stack: process.env.NODE_ENV === 'development' ? stack : {}
    };

    return res.status(status).json(errorResponseBody);
  },
};

module.exports = apiRes;
