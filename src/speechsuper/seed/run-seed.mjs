// One-off seed runner. Run from a host that can reach the DB (e.g. the deployed
// server):  node src/speechsuper/seed/run-seed.mjs
//
// Reads DATABASE_URL from the environment (.env) and executes the .sql file as a
// single multi-statement batch so the @topic_* session variables persist across
// the INSERTs.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "speechsuper-seed.sql"), "utf8");

const url = "mysql://impulse_user8989766:j9Hr53Ae0YbTpEDbBE5aDjLIjUy4zG8Ve2exzdWFDUha8DmK0nElqtRioenZ9hUb@89.167.72.37:7879/impulse_academy_databaseuhiudh_oiwoied";
if (!url) {
  console.error("DATABASE_URL is not set. Run with the backend .env loaded.");
  process.exit(1);
}

const conn = await mysql.createConnection({
  uri: url,
  multipleStatements: true, // required: the seed is one batch sharing @vars
});

try {
  await conn.query(sql);
  const [rows] = await conn.query(
    `SELECT t.title, t.category, COUNT(q.id) AS questions
       FROM speechsuper_topics t
       LEFT JOIN speechsuper_questions q ON q.topic_id = t.id
      GROUP BY t.id ORDER BY t.sort_order`,
  );
  console.table(rows);
  console.log("Seed complete.");
} catch (err) {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
