import express from "express";
import { recommendFood, getHistory } from "../controllers/recipeController.js";

const router = express.Router();

// Gọi GPT API thật
router.post("/generate", recommendFood);

// Lấy lịch sử theo user
router.get("/history/:id", getHistory);

export default router;
