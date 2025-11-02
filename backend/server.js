import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", recipeRoutes);

// Cấu hình OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route test
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🔑 API Key:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing"));