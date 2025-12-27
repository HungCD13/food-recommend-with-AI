import express from "express";
import {
  getSystemStatus,
  getSystemStats,
  healthCheck
} from "../controllers/systemController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// =============================
// 🖥️ SYSTEM APIs
// =============================

// ❤️ Health check (public)
// Dùng để test server còn sống không
router.get("/health", healthCheck);

// ⚙️ Lấy cấu hình hệ thống (admin)
router.get(
  "/config",
  verifyToken,
  adminMiddleware,
  getSystemStatus
);

// 📊 Thống kê hệ thống (admin)
// users, recipes, favorites, history...
router.get(
  "/stats",
  verifyToken,
  adminMiddleware,
  getSystemStats
);

export default router;
