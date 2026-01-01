const employeeRepo = require("../repositories/employees.repo");
const { HttpError } = require("../utils/httpError");

function clampInt(n, { min, max, fallback }) {
  if (!Number.isFinite(n)) return fallback;
  const i = Math.trunc(n);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}

async function listEmployees({ page, limit, search }) {
  const safePage = clampInt(page, { min: 1, max: 100000, fallback: 1 });
  const safeLimit = clampInt(limit, { min: 1, max: 100, fallback: 20 });

  const result = await employeeRepo.list({
    page: safePage,
    limit: safeLimit,
    search: search || ""
  });

  return result;
}

async function getEmployeeById(employeeId) {
  return employeeRepo.getById(employeeId);
}

async function createEmployee({ Name, Position, Salary }) {
  // Extra guard (middleware already validates)
  if (!Name || Salary <= 0) throw new HttpError(400, "VALIDATION_ERROR", "Invalid employee payload");
  return employeeRepo.create({ Name, Position: Position ?? null, Salary });
}

async function updateEmployee(employeeId, { Name, Position, Salary }) {
  if (!Name || Salary <= 0) throw new HttpError(400, "VALIDATION_ERROR", "Invalid employee payload");
  return employeeRepo.update(employeeId, { Name, Position: Position ?? null, Salary });
}

async function deleteEmployee(employeeId) {
  return employeeRepo.remove(employeeId);
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
