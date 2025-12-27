import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import History from "../models/History.js";

// =============================
// DASHBOARD – TỔNG QUAN HỆ THỐNG
// =============================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalHistories = await History.countDocuments();

    return res.json({
      users: totalUsers,
      recipes: totalRecipes,
      generatedRecipes: totalHistories,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ error: "Không lấy được thống kê!" });
  }
};

// =============================
// GET ALL USERS
// =============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    return res.status(500).json({ error: "Không lấy được danh sách user!" });
  }
};

// =============================
// UPDATE USER ROLE
// =============================
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Role không hợp lệ!" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    return res.json({
      message: "Cập nhật role thành công",
      user,
    });
  } catch (err) {
    console.error("Update Role Error:", err);
    return res.status(500).json({ error: "Không cập nhật được role!" });
  }
};

// =============================
// DELETE USER
// =============================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User không tồn tại!" });
    }

    // Xoá dữ liệu liên quan (tuỳ chọn – ghi điểm đồ án)
    await History.deleteMany({ userId: id });
    await Recipe.deleteMany({ createdBy: id });

    return res.json({ message: "Xoá user thành công!" });
  } catch (err) {
    console.error("Delete User Error:", err);
    return res.status(500).json({ error: "Không xoá được user!" });
  }
};

// =============================
// SYSTEM HEALTH CHECK
// =============================
export const systemHealth = async (req, res) => {
  return res.json({
    status: "OK",
    serverTime: new Date(),
    uptime: process.uptime(),
  });
};
