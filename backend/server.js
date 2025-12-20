import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // nếu chưa làm thì tí tạo file rỗng

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("🔥 Cook.io Backend is running smoothly!");
});


app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); 


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n==============================");
  console.log("🚀 Cook.io Backend Started");
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(
    `🔑 OpenAI Key: ${
      process.env.OPENAI_API_KEY ? "Loaded ✔️" : "Missing ❌ (check .env)"
    }`
  );
  console.log("==============================\n");
});
