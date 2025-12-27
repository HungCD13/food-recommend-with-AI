import express from "express";
import {
  recommendFood,
  getHistory,
  generateRecipeImage,
  saveRecipe,
  getSavedRecipes,
  deleteSavedRecipe,
} from "../controllers/recipeController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// =============================
// 🍳 RECIPE APIs
// =============================

// 🤖 AI gợi ý món ăn từ nguyên liệu
// body: { ingredients: "egg, milk" }
router.post("/recommend", verifyToken, recommendFood);

// 🧠 Lịch sử AI generate (theo user)
router.get("/history/:id", verifyToken, getHistory);

// 🖼️ Generate hình ảnh món ăn bằng AI
router.post("/image", generateRecipeImage);

// ❤️ Lưu món ăn yêu thích
router.post("/save", verifyToken, saveRecipe);

// 📚 Lấy danh sách món đã lưu
router.get("/saved", verifyToken, getSavedRecipes);

// ❌ Xoá món đã lưu
router.delete("/saved/:id", verifyToken, deleteSavedRecipe);

// =============================
// 🛠️ ADMIN APIs
// =============================

// 📊 Thống kê hệ thống (admin only)
router.get(
  "/admin/stats",
  verifyToken,
  adminMiddleware,
  (req, res) => {
    res.json({
      totalUsers: 120,
      totalRecipes: 340,
      totalFavorites: 89,
      message: "Admin stats OK 🚀",
    });
  }
);

export default router;
