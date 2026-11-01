/*Quick Script To Test Databse Connection
Run With: npm run ping
*/

import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool
  .query("SELECT NOW()")
  .then((res) => console.log("Connected:", res.rows[0].now))
  .catch((err) => console.error("Connection failed:", err.message))
  .finally(() => pool.end());