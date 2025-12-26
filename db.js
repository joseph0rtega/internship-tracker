const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function initDb() {
  const db = await open({
    filename: path.join(__dirname, "data.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      link TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  return db;
}

module.exports = { initDb };
