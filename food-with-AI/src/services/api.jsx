// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api/recipes";

export async function generateRecipe(ingredientsText) {
  // backend của bạn tự quyết định parse string hay array
  const res = await axios.post(`${API_BASE}/generate`, {
    ingredients: ingredientsText, // hoặc tách ra array tuỳ backend
    prompt: "gợi ý món ăn",
  });

  // Giả sử backend trả về: { recipe: {...} } hoặc { result: {...} }
  // Bạn chỉnh cho khớp với controller nhé.
  return res.data.recipe || res.data;
}
