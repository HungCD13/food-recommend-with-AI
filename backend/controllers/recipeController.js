import OpenAI from "openai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import History from "../models/History.js";
import Recipe from "../models/Recipe.js";


dotenv.config();

// =============================
// OPENAI CLIENT
// =============================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =============================
// RECOMMEND FOOD (AI CORE)
// =============================
export const recommendFood = async (req, res) => {
  try {
    const { ingredients } = req.body;

    // =============================
    // VALIDATE INPUT
    // =============================
    let ingList = [];

if (!req.body.ingredients) {
  return res.status(400).json({
    error: "Vui lòng nhập nguyên liệu",
  });
}

// Nếu frontend gửi STRING: "egg, milk"
if (typeof req.body.ingredients === "string") {
  if (req.body.ingredients.trim() === "") {
    return res.status(400).json({
      error: "Vui lòng nhập nguyên liệu",
    });
  }

  ingList = req.body.ingredients
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);
}

// Nếu frontend gửi ARRAY: ["egg", "milk"]
else if (Array.isArray(req.body.ingredients)) {
  if (req.body.ingredients.length === 0) {
    return res.status(400).json({
      error: "Vui lòng nhập nguyên liệu",
    });
  }

  ingList = req.body.ingredients
    .map((i) => i.trim())
    .filter(Boolean);
}

// Trường hợp khác → sai format
else {
  return res.status(400).json({
    error: "Định dạng nguyên liệu không hợp lệ",
  });
}
    // =============================
    // GET USER ID FROM JWT (OPTIONAL)
    // =============================
    let userId = null;
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      userId = null;
    }

    // =============================
    // PROMPT – JSON OUTPUT
    // =============================
   const prompt = `
Bạn là một đầu bếp chuyên nghiệp.

Danh sách người dùng nhập:
${ingList.join(", ")}

Nhiệm vụ của bạn:

1️.Nếu danh sách trên KHÔNG chứa nguyên liệu nấu ăn hợp lệ
(ví dụ: "abc", "123", "hello", "facebook", "???")
→ Trả về JSON SAU:

{
  "error": "Không nhận diện được nguyên liệu hợp lệ. Vui lòng nhập nguyên liệu nấu ăn."
}

2. Nếu danh sách CÓ nguyên liệu hợp lệ
→ Trả về đúng JSON với cấu trúc:

{
  "title": "Tên món ăn",
  "ingredients": ["...", "..."],
  "instructions": ["Bước 1", "Bước 2", "..."],
  "time": "number (phút)",
  "calories": "number (kcal)"
}
Lưu ý: với time, calories là chuỗi rỗng nếu bạn không biết bạn hãy ước lượng chính xác.
❗ Chỉ trả về JSON hợp lệ
`;

    // =============================
    // CALL OPENAI
    // =============================
    let aiResult;
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      aiResult = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.error("OPENAI ERROR:", err);
      return res.status(500).json({
        error: "Chef AI đang bận, thử lại sau nhé!",
      });
    }

    // =============================
    // ADD IMAGE (FREE – UNSPLASH)
    // =============================
    aiResult.image = `https://source.unsplash.com/900x900/?food,${encodeURIComponent(
      aiResult.title
    )}`;

      // =============================
      // SAVE HISTORY
      // =============================
      try {
        await History.create({
          userId: req.user.id, // từ verifyToken
          title: aiResult.title,
          ingredients: aiResult.ingredients,
          instructions: aiResult.instructions,
          time: aiResult.time,
          calories: aiResult.calories,
          image: aiResult.image,
          rawIngredients: ingList,
        });
      } catch (err) {
        console.error("MONGO SAVE ERROR:", err);
      }

      // =============================
      // RETURN TO FRONTEND
      // =============================
      return res.json(aiResult);
    } catch (err) {
      console.error("SERVER ERROR:", err);
      return res.status(500).json({
        error: "Lỗi server",
      });
    }
  };

  // =============================
  // GET RECIPE HISTORY
  // =============================
  export const getHistory = async (req, res) => {
    try {
      const userId = req.user.id; // lấy từ token

      const history = await History.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      return res.json(history);
    } catch (err) {
      console.error("GET HISTORY ERROR:", err);
      return res.status(500).json({
        error: "Không lấy được lịch sử",
      });
    }
  };


// =============================
// ❤️ SAVE RECIPE
// =============================
export const saveRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      ingredients,
      instructions,
      image,
      time,
      calories,
    } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        message: "Thiếu thông tin công thức",
      });
    }

    const exists = await Recipe.findOne({
      userId,
      title,
    });

    if (exists) {
      return res.status(400).json({
        message: "Công thức đã được lưu trước đó",
      });
    }

    const recipe = await Recipe.create({
      userId,
      title,
      ingredients,
      instructions,
      image,
      time,
      calories,
      generatedByAI: true,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Lưu công thức thành công ❤️",
      recipe,
    });
  } catch (err) {
    console.error("SAVE RECIPE ERROR:", err);
    return res.status(500).json({
      message: "Lỗi server khi lưu công thức",
    });
  }
};


// =============================
// 📚 GET SAVED RECIPES
// =============================
export const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.id; // từ verifyToken

    const recipes = await Recipe.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "title image time calories ingredients instructions createdAt"
      );

    return res.json(recipes);
  } catch (error) {
    console.error("GET SAVED RECIPES ERROR:", error);
    return res.status(500).json({
      message: "Không lấy được danh sách món đã lưu",
    });
  }
};

// =============================
// ❌ DELETE SAVED RECIPE
// =============================
export const deleteSavedRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      userId,
    });

    if (!deletedRecipe) {
      return res.status(404).json({
        message: "Không tìm thấy công thức để xoá",
      });
    }

    return res.json({
      message: "Xoá công thức đã lưu thành công ❌",
    });
  } catch (error) {
    console.error("DELETE SAVED RECIPE ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server khi xoá công thức",
    });
  }
};

// =============================
// 🖼️ GENERATE RECIPE IMAGE (OPTIONAL)
// =============================
export const generateRecipeImage = async (req, res) => {
  return res.json({
    image:
      "https://source.unsplash.com/900x900/?food,dish",
  });
};

