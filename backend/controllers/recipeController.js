import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import jwt from "jsonwebtoken";
import History from "../models/History.js";

dotenv.config();

// =============================
// LOG FILE
// =============================
function writeLog(ingredients, userPrompt, result, userId) {
  const log = `[${new Date().toISOString()}]
UserId: ${userId || "Chưa đăng nhập"}
Ingredients: ${Array.isArray(ingredients) ? ingredients.join(", ") : ingredients}
Prompt: ${userPrompt}
Result: ${result}
----------------------------------

`;

  if (!fs.existsSync("logs")) fs.mkdirSync("logs");
  fs.appendFileSync("logs/gpt.log", log);
}

// =============================
// OPENAI CLIENT
// =============================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Parse JSON an toàn
function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// =============================
// API: RECOMMEND FOOD
// =============================
export const recommendFood = async (req, res) => {
  try {
    let { ingredients, prompt } = req.body;

    // ========================
    // Xử lý JWT
    // ========================
    let userId = null;
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      }
    } catch {
      userId = null;
    }

    // ========================
    // Validate ingredients
    // ========================
    if (!ingredients) {
      return res.status(400).json({ error: "Thiếu nguyên liệu!" });
    }

    // CHUYỂN input string → array
    const ingList = Array.isArray(ingredients)
      ? ingredients
      : ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Thiếu prompt!" });
    }

    // ========================
    // GPT Prompt
    // ========================
    const finalPrompt = `
Nguyên liệu: ${ingList.join(", ")}
Yêu cầu: ${prompt}

Hãy trả lời NGẮN GỌN:
- Tên món
- Nguyên liệu cần
- Cách làm ngắn

Trả lời không lan man.
    `;

    let resultText = "GPT lỗi, thử lại";

    // ========================
    // CALL GPT
    // ========================
    try {
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: finalPrompt,
      });

      resultText =
        response.output_text ||
        response.output?.[0]?.content?.[0]?.text?.value ||
        "Không đọc được output từ GPT.";
    } catch (err) {
      console.error("GPT ERROR:", err);
    }

    // ========================
    // SAVE MONGODB
    // ========================
    try {
      await History.create({
        userId,
        ingredients: ingList,
        prompt,
        result: resultText,
      });
    } catch (err) {
      console.error("MongoDB error:", err);
    }

    // LOG FILE
    writeLog(ingList, prompt, resultText, userId);

    return res.json({ result: resultText });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Lỗi server!" });
  }
};

// =============================
// API: GET HISTORY
// =============================
export const getHistory = async (req, res) => {
  try {
    const userId = req.params.id;

    // Nếu không có user → trả toàn bộ lịch sử
    const query = userId ? { userId } : {};

    const history = await History.find(query).sort({ createdAt: -1 });

    res.json({ history });
  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ error: "Lỗi server!" });
  }
};
