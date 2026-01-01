const { HttpError } = require("../utils/httpError");

/**
 * Validates Employee payload.
 * Requirement: Name not empty, Salary > 0.
 */
function validateEmployee(req, _res, next) {
  const { Name, Position, Salary } = req.body || {};

  const errors = [];

  const nameStr = typeof Name === "string" ? Name.trim() : "";
  if (!nameStr) errors.push({ field: "Name", message: "Name is required." });

  // Salary can come as string from forms
  const salaryNum = typeof Salary === "number" ? Salary : Number(String(Salary ?? "").replace(/,/g, ""));
  if (!Number.isFinite(salaryNum) || salaryNum <= 0) {
    errors.push({ field: "Salary", message: "Salary must be a number greater than 0." });
  }

  if (Position !== undefined && Position !== null) {
    const posStr = typeof Position === "string" ? Position.trim() : "";
    // Position is optional, but if provided should not be absurdly long
    if (posStr.length > 50) errors.push({ field: "Position", message: "Position max length is 50." });
  }

  if (errors.length) {
    return next(new HttpError(400, "VALIDATION_ERROR", "Invalid employee payload", errors));
  }

  // Normalize back to req.body (trim + number)
  req.body.Name = nameStr;
  req.body.Salary = salaryNum;
  if (typeof Position === "string") req.body.Position = Position.trim();

  return next();
}

module.exports = { validateEmployee };
