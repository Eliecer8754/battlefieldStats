import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import battlefieldRoutes from "./routes/battlefieldRoutes.js";
import { sql } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/battlefieldStats", battlefieldRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        score INT NOT NULL,
        kills INT,
        deaths INT,
        assists INT,
        player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE
      )
    `;

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing DB:", error);
  }
}

initDB().then(() => {
  server.listen(PORT, () => {  
    console.log("Server running on port:", PORT);
  });
});
