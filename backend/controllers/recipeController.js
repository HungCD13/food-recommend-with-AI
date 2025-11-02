import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const recommendFood = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "Thiếu nguyên liệu!" });
    }

    const prompt = `
    Hãy gợi ý 10 món ăn theo yêu cầu của người dùng ${ingredients}.
    Trả về kết quả ngắn gọn, có tên món ăn, nguyên liệu chính và cách chế biến.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error("❌ Lỗi GPT:", error);
    if (error.status === 401)
      return res.status(401).json({ error: "Sai API Key hoặc chưa cấu hình .env" });
    if (error.status === 429)
      return res.status(429).json({ error: "Vượt giới hạn gọi API (Rate Limit)" });
    res.status(500).json({ error: "Lỗi server GPT" });
  }
};
