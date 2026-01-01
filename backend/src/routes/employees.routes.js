const express = require("express");
const {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employees.controller");
const { validateEmployee } = require("../middlewares/validateEmployee");

const router = express.Router();

router.get("/", listEmployees);
router.get("/:id", getEmployeeById);
router.post("/", validateEmployee, createEmployee);
router.put("/:id", validateEmployee, updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
