import Favorite from "../models/Favorite.js";

// =============================
// TOGGLE FAVORITE
// =============================
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 lấy từ verifyToken

    const { recipe } = req.body;
    if (!recipe || !recipe.title) {
      return res.status(400).json({
        message: "Thiếu dữ liệu món ăn",
      });
    }

    const exists = await Favorite.findOne({
      userId,
      "recipe.title": recipe.title,
    });

    if (exists) {
      await exists.deleteOne();
      return res.json({
        saved: false,
        message: "Đã bỏ lưu món ăn",
      });
    }

    const favorite = await Favorite.create({
      userId,
      recipe,
    });

    return res.status(201).json({
      saved: true,
      message: "Đã lưu món ăn",
      favorite,
    });
  } catch (error) {
    console.error("TOGGLE FAVORITE ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server khi lưu món ăn",
    });
  }
};

// =============================
// GET FAVORITES
// =============================
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId }).sort({
      createdAt: -1,
    });

    return res.json(favorites);
  } catch (error) {
    console.error("GET FAVORITES ERROR:", error);
    return res.status(500).json({
      message: "Không lấy được danh sách món đã lưu",
    });
  }
};

// =============================
// REMOVE FAVORITE
// =============================
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const favorite = await Favorite.findOne({ _id: id, userId });
    if (!favorite) {
      return res.status(404).json({
        message: "Không tìm thấy món ăn đã lưu",
      });
    }

    await favorite.deleteOne();

    return res.json({
      message: "Đã xóa món ăn khỏi danh sách yêu thích",
    });
  } catch (error) {
    console.error("REMOVE FAVORITE ERROR:", error);
    return res.status(500).json({
      message: "Lỗi server khi xóa món ăn",
    });
  }
};
