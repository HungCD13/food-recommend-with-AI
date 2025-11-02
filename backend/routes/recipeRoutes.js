import express from "express";
import { recommendFood } from "../controllers/recipeController.js";

const router = express.Router();

// POST /api/recommend
router.post("/recommend", recommendFood);

export default router;
