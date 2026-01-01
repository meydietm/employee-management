require("dotenv").config();
const app = require("./app");
const { getPool } = require("./db/pool");

app.get("/api/db-check", async (_req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT 1 AS ok");
    res.json({ db: "ok", result: result.recordset?.[0] ?? null });
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Unexpected server error" }
  });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));