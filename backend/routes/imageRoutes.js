import express from "express";
import { generateFoodImage } from "../controllers/imageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================
// IMAGE GENERATION (AI)
// =============================

// Generate image cho món ăn 🍽️
// (Có thể bật/tắt verifyToken tuỳ yêu cầu đồ án)
router.post("/generate", verifyToken, generateFoodImage);

export default router;
