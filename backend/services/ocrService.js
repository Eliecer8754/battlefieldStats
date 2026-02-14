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
import fs from "fs";
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function extractStatsFromImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const prompt = `
Analyze this Battlefield scoreboard screenshot.
Return ONLY valid JSON as an array of players, each with:
player_name, score, kills, deaths, assists, level.
No explanations, no extra text.
Image data (base64): ${base64Image}
    `;

    const response = await openrouter.chat.send({
      chatGenerationParams: {   // <--- CORRECCIÓN AQUÍ
        model: "liquid/lfm-2.5-1.2b-instruct:free",
        messages: [
          { role: "user", content: prompt }
        ],
      },
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("OpenRouter AI error:", error.response?.data || error.message);
    throw error;
  }
}

