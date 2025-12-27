import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// =============================
// OPENAI CLIENT
// =============================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =============================
// GENERATE FOOD IMAGE (AI)
// =============================
export const generateFoodImage = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Thiếu tên món ăn",
      });
    }

    const prompt = `
A high-quality, realistic food photography of the dish:
"${title}"

- professional lighting
- restaurant style plating
- ultra detailed
- 4K food photography
- clean background
`;

    const imageResult = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageBase64 = imageResult.data[0].b64_json;

    return res.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("IMAGE GENERATION ERROR:", error);
    return res.status(500).json({
      error: "Không tạo được hình ảnh món ăn",
    });
  }
};
