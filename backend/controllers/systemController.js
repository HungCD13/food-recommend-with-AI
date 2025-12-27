import History from "../models/History.js";

// =============================
// SYSTEM STATUS
// =============================
export const getSystemStatus = async (req, res) => {
  try {
    return res.json({
      status: "running",
      serverTime: new Date(),
      message: "Cook.io AI System is running smoothly 🚀",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Cannot get system status",
    });
  }
};

// =============================
// SYSTEM STATISTICS
// =============================
export const getSystemStats = async (req, res) => {
  try {
    const totalRecipes = await History.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecipes = await History.countDocuments({
      createdAt: { $gte: today },
    });

    return res.json({
      totalRecipesGenerated: totalRecipes,
      recipesGeneratedToday: todayRecipes,
    });
  } catch (err) {
    console.error("SYSTEM STATS ERROR:", err);
    return res.status(500).json({
      message: "Không lấy được thống kê hệ thống",
    });
  }
};

// =============================
// SYSTEM HEALTH CHECK
// =============================
export const healthCheck = async (req, res) => {
  try {
    // test MongoDB connection
    await History.findOne();

    return res.json({
      api: "OK",
      database: "Connected",
      timestamp: new Date(),
    });
  } catch (err) {
    return res.status(500).json({
      api: "OK",
      database: "Disconnected",
      error: err.message,
    });
  }
};
