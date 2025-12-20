import express from "express";
const router = express.Router();

// ví dụ (tùy bạn làm)
router.post("/register", (req, res) => res.send("Register API"));
router.post("/login", (req, res) => res.send("Login API"));

export default router;
