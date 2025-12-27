import express from "express";
import {
  addIngredient,
  getIngredients,
  deleteIngredient,
} from "../controllers/ingredientController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================
// INGREDIENT APIs
// =============================

// ➕ Thêm nguyên liệu
router.post("/", verifyToken, addIngredient);

// 📄 Lấy danh sách nguyên liệu
router.get("/", getIngredients);

// ❌ Xóa nguyên liệu
router.delete("/:id", verifyToken, deleteIngredient);

export default router;
