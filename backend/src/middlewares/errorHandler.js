const { HttpError } = require("../utils/httpError");

function errorHandler(err, _req, res, _next) {
  // Known errors
  if (err instanceof HttpError) {
    const payload = {
      error: {
        code: err.code,
        message: err.message
      }
    };
    if (err.details !== undefined) payload.error.details = err.details;
    return res.status(err.status).json(payload);
  }

  // Unknown errors
  console.error(err);
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: err?.message || "Unexpected server error"
    }
  });
}

module.exports = { errorHandler };
