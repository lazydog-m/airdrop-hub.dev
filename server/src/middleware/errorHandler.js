const apiRes = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  const errStatus = err.status;
  const errStatusCode = err.errorStatusCode;
  const errMsg = err.message;
  const errStack = err.stack;

  return apiRes.toError(res, errStatus, errStatusCode, errMsg, errStack);
}

module.exports = errorHandler;
