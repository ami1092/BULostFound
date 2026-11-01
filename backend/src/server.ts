//Server will be run here with: npm run dev
// Note: API requests are currently public, but should be restricted to only logged in users later, maybe through passing in an authentication token

import "dotenv/config";

const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/status", (req: any, res: any) => {
  res.json({
    ok: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/items", async (req: any, res: any) => {
  try {
    const result = await pool.query(
      "SELECT * FROM items ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/api/items", async (req: any, res: any) => {
  const {
    item_name,
    item_description,
    image_url,
    item_type,
    found_location,
    user_id,
  } = req.body;

  if (!item_name || !item_description || !image_url || !item_type || !found_location) {
    return res.status(400).json({ error: "Missing required item fields" });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO items (item_name, item_description, image_url, item_type, found_location, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [item_name, item_description, image_url, item_type, found_location, user_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.get("/api/users", async (req: any, res: any) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});