import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// =============================
// ROUTES
// =============================
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import historyRoutes from './routes/historyRoutes.js';


// =============================
// CONFIG
// =============================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =============================
// API ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/history', historyRoutes);// =============================
// ROOT TEST
// =============================
app.get("/", (req, res) => {
  res.json({
    message: "🍳 CookIO API is running!",
    status: "OK",
    version: "1.0.0",
  });
});

// =============================
// ERROR HANDLER
// =============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
  });
});

// =============================
// DATABASE CONNECT
// =============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
