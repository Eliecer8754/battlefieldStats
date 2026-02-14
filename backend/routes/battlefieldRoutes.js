// backend/routes/battlefieldRoutes.js
import express from "express";
import multer from "multer";
import { getMatchesCount, getSquadStatsByMonth, uploadScreenshot } from "../controllers/battlefieldControllers.js";

const router = express.Router();

// Temp storage folder
const upload = multer({ dest: "backend/uploads/" });

router.post("/upload", upload.single("image"), uploadScreenshot);
router.get("/", getSquadStatsByMonth)
router.get("/matches/count", getMatchesCount)
export default router;
