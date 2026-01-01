const sql = require("mssql");

let pool;

async function getPool() {
  if (pool) return pool;

  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),
    database: process.env.DB_NAME,
    options: {
      encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === "true",
      trustServerCertificate: true
    }
  };

  pool = await sql.connect(config);
  return pool;
}

module.exports = { sql, getPool };