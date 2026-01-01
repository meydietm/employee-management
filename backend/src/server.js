require("dotenv").config();
const app = require("./app");
const { getPool } = require("./db/pool");
const { errorHandler } = require("./middlewares/errorHandler");

// DB connectivity smoke test
app.get("/api/db-check", async (_req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT 1 AS ok");
    res.json({ db: "ok", result: result.recordset?.[0] ?? null });
  } catch (err) {
    next(err);
  }
});

// Error handler (keep LAST)
app.use(errorHandler);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
