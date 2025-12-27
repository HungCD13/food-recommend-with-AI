import Ingredient from "../models/Ingredient.js";

// =============================
// ADD INGREDIENT (USER INPUT)
// =============================
export const addIngredient = async (req, res) => {
  try {
    const { name } = req.body;

    if (!ingredients || ingredients.trim() === "") {
  return res.status(400).json({
    message: "Vui lòng nhập ít nhất 1 nguyên liệu"
  });
}
    // Chuẩn hóa tên nguyên liệu
    const ingredientName = name.trim().toLowerCase();

    // Check tồn tại
    const exists = await Ingredient.findOne({ name: ingredientName });
    if (exists) {
      return res.status(400).json({
        message: "Nguyên liệu đã tồn tại",
      });
    }

    const ingredient = await Ingredient.create({
      name: ingredientName,
    });

    return res.status(201).json({
      message: "Thêm nguyên liệu thành công",
      ingredient,
    });
  } catch (error) {
    console.error("ADD INGREDIENT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server khi thêm nguyên liệu",
    });
  }
};

// =============================
// GET ALL INGREDIENTS
// =============================
export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });

    return res.json(ingredients);
  } catch (error) {
    console.error("GET INGREDIENTS ERROR:", error);
    return res.status(500).json({
      message: "Không lấy được danh sách nguyên liệu",
    });
  }
};

// =============================
// DELETE INGREDIENT
// =============================
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({
        message: "Không tìm thấy nguyên liệu",
      });
    }

    await ingredient.deleteOne();

    return res.json({
      message: "Xóa nguyên liệu thành công",
    });
  } catch (error) {
    console.error("DELETE INGREDIENT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server khi xóa nguyên liệu",
    });
  }
};
