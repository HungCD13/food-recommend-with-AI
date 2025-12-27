import express from "express";
import {
  toggleFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ❤️ Toggle lưu / bỏ lưu
router.post("/toggle", verifyToken, toggleFavorite);

// 📚 Lấy danh sách đã lưu
router.get("/", verifyToken, getFavorites);

// ❌ Xoá món đã lưu
router.delete("/:id", verifyToken, removeFavorite);

export default router;
