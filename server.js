const express = require("express");
const { initDb } = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

async function start() {
  const db = await initDb();

  // GET all applications
  app.get("/api/applications", async (req, res) => {
    const rows = await db.all(
      "SELECT * FROM applications ORDER BY createdAt DESC"
    );
    res.json(rows);
  });

  // POST create a new application
  app.post("/api/applications", async (req, res) => {
    const { company, role, link, status } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: "company and role are required" });
    }

    const newApp = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      link: (link || "").trim(),
      status: (status || "Applied").trim(),
      createdAt: new Date().toISOString(),
    };

    await db.run(
      `INSERT INTO applications (id, company, role, link, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newApp.id,
        newApp.company,
        newApp.role,
        newApp.link,
        newApp.status,
        newApp.createdAt,
      ]
    );

    res.status(201).json(newApp);
  });

  // DELETE an application by id
  app.delete("/api/applications/:id", async (req, res) => {
    const id = Number(req.params.id);

    const result = await db.run("DELETE FROM applications WHERE id = ?", id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "not found" });
    }

    res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
