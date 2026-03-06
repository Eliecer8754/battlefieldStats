// backend/controllers/battlefieldControllers.js
import { extractStatsFromImage } from "../services/ocrService.js";
import fs from "fs";
import { sql } from "../config/db.js";
import { io } from "../server.js";

export const getMatchesCount = async (req, res) => {
  try {
    const result = await sql`
      SELECT COUNT(*) AS total
      FROM matches
      WHERE DATE_TRUNC('month', played_at) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    res.json({ total: Number(result[0].total) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error counting matches" });
  }
};

export const getSquadStatsByMonth = async (req, res) => {
  try {
    const squad = [
      "Visuetti5075029",
      "javierKiller13",
      "RACG507PTY",
      "isaacvisuetti"
    ];

    const stats = await sql`
      SELECT 
        p.nickname,
        SUM(s.kills) AS kills,
        SUM(s.deaths) AS deaths,
        SUM(s.assists) AS assists,
        SUM(s.score) AS score
      FROM stats s
      JOIN players p ON p.id = s.player_id
      JOIN matches m ON m.id = s.match_id
      WHERE p.nickname = ANY(${squad})
      AND DATE_TRUNC('month', m.played_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY p.nickname
    `;

    res.json({ success: true, data: stats });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get squad stats", details: error.message });
  }
};


export const uploadScreenshot = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Procesar imagen con OpenRouter
    let statsJson = await extractStatsFromImage(req.file.path);
    statsJson = statsJson.replace(/```json|```/g, "").trim();
    fs.unlinkSync(req.file.path);

    const data = JSON.parse(statsJson);

    // Crear un nuevo match
    const insertedMatch = await sql`INSERT INTO matches DEFAULT VALUES RETURNING id`;
    const matchId = insertedMatch[0].id;

    // Guardar cada jugador y sus stats
    for (let player of data) {
      const existing = await sql`SELECT id FROM players WHERE nickname = ${player.player_name}`;
      let playerId;
      if (existing.length > 0) {
        playerId = existing[0].id;
      } else {
        const inserted = await sql`INSERT INTO players (nickname) VALUES (${player.player_name}) RETURNING id`;
        playerId = inserted[0].id;
      }

      await sql`
        INSERT INTO stats (score, kills, deaths, assists, player_id, match_id)
        VALUES (${player.score}, ${player.kills}, ${player.deaths}, ${player.assists}, ${playerId}, ${matchId})
      `;
    }

    io.emit("new-stats");
    res.json({ message: "Processed and saved successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed", details: error.message });
  }
};


export const getMatchesGroupedByDay = async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        DATE(m.played_at) AS match_day,
        m.id AS match_id,
        json_agg(
          json_build_object(
            'nickname', p.nickname,
            'kills', s.kills,
            'deaths', s.deaths,
            'assists', s.assists,
            'score', s.score
          )
        ) AS players
      FROM matches m
      JOIN stats s ON s.match_id = m.id
      JOIN players p ON p.id = s.player_id
      GROUP BY match_day, m.id
      ORDER BY match_day DESC, m.id DESC
    `;

    // Now group matches under each day
    const grouped = result.reduce((acc, row) => {
      const day = row.match_day;

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push({
        match_id: row.match_id,
        players: row.players
      });

      return acc;
    }, {});

    res.json(grouped);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get matches by day" });
  }
};

