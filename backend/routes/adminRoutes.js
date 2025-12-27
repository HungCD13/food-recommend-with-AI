import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  systemHealth,
} from "../controllers/adminController.js";

const router = express.Router();

// =============================
// ADMIN MIDDLEWARE
// =============================
// verifyToken  -> kiểm tra đăng nhập
// adminMiddleware      -> kiểm tra quyền admin

// =============================
// USER MANAGEMENT
// =============================

// Lấy danh sách toàn bộ user
router.get("/users", verifyToken, adminMiddleware, getAllUsers);

// Khóa / mở khóa user
router.put(
  "/users/:id/role",
  verifyToken,
  adminMiddleware,
  updateUserRole
);
// ❌ XOÁ USER (ADMIN)
router.delete(
  "/users/:id",
  verifyToken,
  adminMiddleware,
  deleteUser
);

// =============================
// SYSTEM STATS
// =============================

// Thống kê hệ thống
router.get("/stats", verifyToken, adminMiddleware, systemHealth);

export default router;
