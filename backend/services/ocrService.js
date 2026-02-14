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
// backend/services/ocrService.js
// backend/services/ocrService.js
// backend/services/ocrService.js
import fs from "fs";
import Tesseract from "tesseract.js";
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Extrae estadísticas de Battlefield de una imagen usando OCR + OpenRouter
 * @param {string} imagePath - Ruta local de la imagen
 * @returns {Promise<string>} - JSON string con arreglo de jugadores
 */
export async function extractStatsFromImage(imagePath) {
  try {
    // 1️⃣ OCR para extraer texto del scoreboard
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log("OCR:", m.status, m.progress?.toFixed(2)),
    });

    // 2️⃣ Prompt para el modelo instruct
    const prompt = `
Analyze this Battlefield scoreboard text:
${text}

Return ONLY valid JSON as an array of players, each with:
player_name, score, kills, deaths, assists, level.
No explanations, no extra text.
`;

    // 3️⃣ Llamada al modelo de OpenRouter (SIN streaming)
    const response = await openrouter.chat.send({
      model: "liquid/lfm-2.5-1.2b-instruct:free",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    // 4️⃣ Obtener la respuesta completa
    const output = response.choices[0].message.content;

    // 5️⃣ Limpiar posibles ```json
    return output.replace(/```json|```/g, "").trim();
  } catch (error) {
    console.error("OCR + OpenRouter error:", error.response?.data || error.message);
    throw error;
  }
}



