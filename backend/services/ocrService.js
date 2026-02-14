// backend/services/ocrService.js with gemini
// import fs from "fs";
// import { gemini } from "../lib/gemini.js";

// export async function extractStatsFromImage(imagePath) {
//   const imageBuffer = fs.readFileSync(imagePath);
//   const base64Image = imageBuffer.toString("base64");

//   try {
//     const response = await gemini.models.generateContent({
//       model: "gemini-3-flash-preview", // check your key supports this model
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `
// Analyze this Battlefield scoreboard screenshot.
// Return ONLY valid JSON as an array of players, each with:
// player_name, score, kills, deaths, assists, level.
// No explanations, no extra text.
//             `,
//             },
//             {
//               inlineData: {
//                 mimeType: "image/jpeg",
//                 data: base64Image,
//               },
//             },
//           ],
//         },
//       ],
//     });

//     return response.text; // this should be the JSON string
//   } catch (error) {
//     console.error("Gemini error:", error);
//     throw error;
//   }
// }

//whit nano banana

// backend/services/ocrService.js
// backend/services/ocrService.js
import fs from "fs";
import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // tu clave en .env
const OPENROUTER_ENDPOINT = "https://api.openrouter.ai/v1/completions";

/**
 * Procesa una imagen y extrae estadísticas de Battlefield
 * @param {string} imagePath - Ruta local de la imagen
 * @returns {Promise<string>} - JSON string con arreglo de jugadores
 */
export async function extractStatsFromImage(imagePath) {
  try {
    // Leer la imagen
    const imageBuffer = fs.readFileSync(imagePath);

    // Algunos modelos OpenRouter prefieren URL de imagen; si tu imagen es muy grande,
    // considera subirla a un hosting temporal y usar la URL en lugar de base64
    const base64Image = imageBuffer.toString("base64");

    // Prompt para el modelo
    const prompt = `
Analyze this Battlefield scoreboard screenshot.
Return ONLY valid JSON as an array of players, each with:
player_name, score, kills, deaths, assists, level.
No explanations, no extra text.
`;

    // Llamada a OpenRouter
    const response = await axios.post(
      OPENROUTER_ENDPOINT,
      {
        model: "liquid/lfm2.5-1.2b-instruct", // modelo gratuito multimodal
        input: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image", image_data: base64Image }, // OpenRouter permite 'image_data'
            ],
          },
        ],
        max_output_tokens: 1024,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const result = response.data?.output?.[0]?.content?.[0]?.text;

    if (!result) throw new Error("No data returned from AI");

    return result; // JSON string como en Gemini
  } catch (error) {
    console.error(
      "OpenRouter AI error:",
      error.response?.data || error.message
    );
    throw error;
  }
}


