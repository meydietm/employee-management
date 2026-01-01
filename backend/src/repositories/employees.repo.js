const { getPool, sql } = require("../db/pool");

function mapRow(row) {
  if (!row) return null;
  return {
    EmployeeID: row.EmployeeID,
    Name: row.Name,
    Position: row.Position,
    Salary: Number(row.Salary),
    CreatedAt: row.CreatedAt
  };
}

async function list({ page, limit, search }) {
  const pool = await getPool();
  const offset = (page - 1) * limit;
  const hasSearch = Boolean(search);

  const whereSql = hasSearch ? "WHERE Name LIKE '%' + @Search + '%'" : "";

  // Total
  const countReq = pool.request();
  if (hasSearch) countReq.input("Search", sql.VarChar(100), search);
  const countRes = await countReq.query(`SELECT COUNT(*) AS total FROM dbo.Employees ${whereSql};`);
  const total = Number(countRes.recordset?.[0]?.total ?? 0);

  // Page rows
  const dataReq = pool.request();
  if (hasSearch) dataReq.input("Search", sql.VarChar(100), search);
  dataReq.input("Offset", sql.Int, offset);
  dataReq.input("Limit", sql.Int, limit);

  const dataRes = await dataReq.query(`
    SELECT EmployeeID, Name, Position, Salary, CreatedAt
    FROM dbo.Employees
    ${whereSql}
    ORDER BY EmployeeID DESC
    OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
  `);

  const rows = (dataRes.recordset || []).map(mapRow);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data: rows,
    meta: {
      page,
      limit,
      total,
      totalPages,
      search: search || ""
    }
  };
}

async function getById(employeeId) {
  const pool = await getPool();
  const req = pool.request();
  req.input("EmployeeID", sql.Int, employeeId);

  const res = await req.query(`
    SELECT EmployeeID, Name, Position, Salary, CreatedAt
    FROM dbo.Employees
    WHERE EmployeeID = @EmployeeID;
  `);

  return mapRow(res.recordset?.[0] ?? null);
}

async function create({ Name, Position, Salary }) {
  const pool = await getPool();
  const req = pool.request();
  req.input("Name", sql.VarChar(100), Name);
  req.input("Position", sql.VarChar(50), Position);
  req.input("Salary", sql.Decimal(12, 2), Salary);

  const res = await req.query(`
    INSERT INTO dbo.Employees (Name, Position, Salary)
    OUTPUT INSERTED.EmployeeID, INSERTED.Name, INSERTED.Position, INSERTED.Salary, INSERTED.CreatedAt
    VALUES (@Name, @Position, @Salary);
  `);

  return mapRow(res.recordset?.[0] ?? null);
}

async function update(employeeId, { Name, Position, Salary }) {
  const pool = await getPool();
  const req = pool.request();
  req.input("EmployeeID", sql.Int, employeeId);
  req.input("Name", sql.VarChar(100), Name);
  req.input("Position", sql.VarChar(50), Position);
  req.input("Salary", sql.Decimal(12, 2), Salary);

  const res = await req.query(`
    UPDATE dbo.Employees
    SET Name = @Name,
        Position = @Position,
        Salary = @Salary
    WHERE EmployeeID = @EmployeeID;

    SELECT @@ROWCOUNT AS affected;

    SELECT EmployeeID, Name, Position, Salary, CreatedAt
    FROM dbo.Employees
    WHERE EmployeeID = @EmployeeID;
  `);

  const affected = Number(res.recordsets?.[0]?.[0]?.affected ?? 0);
  if (!affected) return null;

  // last SELECT is in recordsets[1]
  const updated = res.recordsets?.[1]?.[0] ?? null;
  return mapRow(updated);
}

async function remove(employeeId) {
  const pool = await getPool();
  const req = pool.request();
  req.input("EmployeeID", sql.Int, employeeId);

  const res = await req.query(`
    DELETE FROM dbo.Employees
    WHERE EmployeeID = @EmployeeID;
  `);

  return (res.rowsAffected?.[0] ?? 0) > 0;
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};
