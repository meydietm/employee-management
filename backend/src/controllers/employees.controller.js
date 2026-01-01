const employeeService = require("../services/employees.service");
const { HttpError } = require("../utils/httpError");

function parseId(idRaw) {
  const id = Number(idRaw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function listEmployees(req, res, next) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const result = await employeeService.listEmployees({ page, limit, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) throw new HttpError(400, "VALIDATION_ERROR", "Invalid EmployeeID");

    const employee = await employeeService.getEmployeeById(id);
    if (!employee) throw new HttpError(404, "NOT_FOUND", "Employee not found");

    res.json({ data: employee });
  } catch (err) {
    next(err);
  }
}

async function createEmployee(req, res, next) {
  try {
    const { Name, Position, Salary } = req.body;
    const created = await employeeService.createEmployee({ Name, Position, Salary });
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) throw new HttpError(400, "VALIDATION_ERROR", "Invalid EmployeeID");

    const { Name, Position, Salary } = req.body;
    const updated = await employeeService.updateEmployee(id, { Name, Position, Salary });

    if (!updated) throw new HttpError(404, "NOT_FOUND", "Employee not found");

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) throw new HttpError(400, "VALIDATION_ERROR", "Invalid EmployeeID");

    const ok = await employeeService.deleteEmployee(id);
    if (!ok) throw new HttpError(404, "NOT_FOUND", "Employee not found");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
