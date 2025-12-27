// routes/historyRoutes.js
import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// =============================
// GET ALL HISTORY FOR LOGGED IN USER
// =============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Fetching recipe history for user: ${userId}`);

    // Tìm tất cả recipes của user hiện tại
    const recipes = await Recipe.find({ 
      $or: [
        { userId: userId },
        { createdBy: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(100);

    console.log(`Found ${recipes.length} recipes for user ${userId}`);

    return res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });

  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Không thể lấy lịch sử",
      details: err.message
    });
  }
});

// =============================
// GET SINGLE RECIPE BY ID (chỉ cho chủ sở hữu)
// =============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`Fetching recipe ${id} for user ${userId}`);

    const recipe = await Recipe.findOne({ 
      _id: id,
      $or: [
        { userId: userId },
        { createdBy: userId }
      ]
    });

    if (!recipe) {
      console.log(`Recipe ${id} not found or unauthorized access`);
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy công thức hoặc không có quyền truy cập"
      });
    }

    return res.status(200).json({
      success: true,
      data: recipe
    });

  } catch (err) {
    console.error("GET RECIPE BY ID ERROR:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: "ID công thức không hợp lệ"
      });
    }

    return res.status(500).json({
      success: false,
      error: "Không thể lấy công thức",
      details: err.message
    });
  }
});

// =============================
// DELETE RECIPE BY ID
// =============================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`Deleting recipe ${id} for user ${userId}`);

    const result = await Recipe.findOneAndDelete({ 
      _id: id,
      $or: [
        { userId: userId },
        { createdBy: userId }
      ]
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy công thức hoặc không có quyền xóa"
      });
    }

    console.log(`Recipe ${id} deleted successfully`);

    return res.status(200).json({
      success: true,
      message: "Đã xóa công thức thành công",
      data: {
        deletedId: id
      }
    });

  } catch (err) {
    console.error("DELETE RECIPE ERROR:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: "ID công thức không hợp lệ"
      });
    }

    return res.status(500).json({
      success: false,
      error: "Không thể xóa công thức",
      details: err.message
    });
  }
});

// =============================
// CLEAR ALL USER HISTORY
// =============================
router.delete("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`Clearing all recipes for user ${userId}`);

    const result = await Recipe.deleteMany({ 
      $or: [
        { userId: userId },
        { createdBy: userId }
      ]
    });

    console.log(`Deleted ${result.deletedCount} recipes for user ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Đã xóa toàn bộ lịch sử thành công",
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (err) {
    console.error("CLEAR HISTORY ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Không thể xóa lịch sử",
      details: err.message
    });
  }
});

// =============================
// SEARCH USER HISTORY
// =============================
router.get("/search/all", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { q: query } = req.query;

    console.log(`Searching recipes for user ${userId}: "${query}"`);

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập từ khóa tìm kiếm"
      });
    }

    const searchResults = await Recipe.find({
      $or: [
        { userId: userId },
        { createdBy: userId }
      ],
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { ingredients: { $regex: query, $options: 'i' } },
        { 'ingredients.$': { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: searchResults.length,
      data: searchResults
    });

  } catch (err) {
    console.error("SEARCH HISTORY ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Không thể tìm kiếm lịch sử",
      details: err.message
    });
  }
});

// =============================
// GET HISTORY STATS
// =============================
router.get("/stats/overview", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`Getting stats for user ${userId}`);

    // Thống kê tổng quan
    const stats = await Recipe.aggregate([
      { 
        $match: { 
          $or: [
            { userId: mongoose.Types.ObjectId(userId) },
            { createdBy: mongoose.Types.ObjectId(userId) }
          ]
        } 
      },
      {
        $group: {
          _id: null,
          totalRecipes: { $sum: 1 },
          totalTime: { 
            $sum: { 
              $convert: {
                input: { $arrayElemAt: [{ $split: ["$time", " "] }, 0] },
                to: 'int',
                onError: 0,
                onNull: 0
              }
            }
          },
          totalCalories: { 
            $sum: { 
              $convert: {
                input: { $arrayElemAt: [{ $split: ["$calories", " "] }, 0] },
                to: 'int',
                onError: 0,
                onNull: 0
              }
            }
          },
          firstRecipeDate: { $min: "$createdAt" },
          lastRecipeDate: { $max: "$createdAt" }
        }
      }
    ]);

    // Thống kê theo tháng
    const monthlyStats = await Recipe.aggregate([
      { 
        $match: { 
          $or: [
            { userId: mongoose.Types.ObjectId(userId) },
            { createdBy: mongoose.Types.ObjectId(userId) }
          ]
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalRecipes: 0,
          totalTime: 0,
          totalCalories: 0,
          firstRecipeDate: null,
          lastRecipeDate: null
        },
        monthly: monthlyStats
      }
    });

  } catch (err) {
    console.error("GET HISTORY STATS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Không thể lấy thống kê",
      details: err.message
    });
  }
});

export default router;