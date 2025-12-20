import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin API is active");
});

export default router;
