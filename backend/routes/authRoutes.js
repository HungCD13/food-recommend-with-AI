import express from "express";
import {
  register,
  login,
  getCurrentUser
} from "../controllers/authController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================
// AUTH
// =============================

// Đăng ký tài khoản
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Lấy thông tin user hiện tại
router.get("/profile", verifyToken, getCurrentUser);

export default router;
