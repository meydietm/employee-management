const express = require("express");
const cors = require("cors");

const employeesRoutes = require("./routes/employees.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Employees CRUD
app.use("/api/employees", employeesRoutes);

module.exports = app;
