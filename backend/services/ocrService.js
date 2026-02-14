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
import fs from "fs";
import axios from "axios";

const AIML_API_KEY = process.env.AIML_API_KEY; // tu clave en .env
const AIML_ENDPOINT = "https://api.aimlapi.com/v1/images/generations";

/**
 * Procesa una imagen y extrae estadísticas de Battlefield
 * @param {string} imagePath - Ruta local de la imagen
 * @returns {Promise<string>} - JSON string con arreglo de jugadores
 */
export async function extractStatsFromImage(imagePath) {
  try {
    // Leer imagen y pasar a base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Prompt para el modelo
    const prompt = `
Analyze this Battlefield scoreboard screenshot.
Return ONLY valid JSON as an array of players, each with:
player_name, score, kills, deaths, assists, level.
No explanations, no extra text.
`;

    // Llamada a Nano Banana Pro / Gemini 3 Pro Image
    const response = await axios.post(
      AIML_ENDPOINT,
      {
        model: "google/nano-banana-pro",
        prompt,
        aspect_ratio: "1:1",
        resolution: "1K",
        num_images: 1,
        // Podemos incluir la imagen en base64 si quieres OCR/analisis visual
        // Algunas implementaciones de OpenClaw permiten esto en "image" o "source_image"
        source_image: base64Image,
      },
      {
        headers: {
          Authorization: `Bearer ${AIML_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    // Normalmente el resultado estará en response.data.data[0]
    const result = response.data.data?.[0];
    if (!result) throw new Error("No data returned from AI");

    // Retornamos como string JSON, igual que tu Gemini antiguo
    return result.text || JSON.stringify({ error: "No text returned" });
  } catch (error) {
    console.error("AI/ML error:", error.response?.data || error.message);
    throw error;
  }
}

