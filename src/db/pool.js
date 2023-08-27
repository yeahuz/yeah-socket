import pkg from "pg";
import config from "../config/index.js";

let { Pool } = pkg;

export let pool = new Pool({ connectionString: config.postgres_uri, connectionTimeoutMillis: 1000 });

export async function query(text, params) {
  console.log("executing query", { text });
  let start = performance.now();
  let res = await pool.query(text, params);
  let duration = (performance.now() - start).toFixed(2);
  console.log("executed query", { duration, rows: res.rowCount });
  return res;
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
