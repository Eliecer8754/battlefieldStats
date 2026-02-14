import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import battlefieldRoutes from "./routes/battlefieldRoutes.js"
import { sql } from "./config/db.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors());
app.use(helmet());

app.use("/api/battlefieldStats", battlefieldRoutes);

async function initDB(){
    try {
    // Tabla de jugadores
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Tabla de partidas
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Tabla de estadísticas
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

initDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("app runing in port:", PORT)
    })
})

