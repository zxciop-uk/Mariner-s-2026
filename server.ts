import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database("notes.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    content TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/notes", (req, res) => {
    const notes = db.prepare("SELECT * FROM notes").all();
    const notesMap = notes.reduce((acc: any, note: any) => {
      acc[note.id] = note.content;
      return acc;
    }, {});
    res.json(notesMap);
  });

  app.post("/api/notes", (req, res) => {
    const { id, content } = req.body;
    const upsert = db.prepare(`
      INSERT INTO notes (id, content) VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET content=excluded.content
    `);
    upsert.run(id, content);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
