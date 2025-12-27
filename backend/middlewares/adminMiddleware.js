// =============================
// 🛠️ ADMIN MIDDLEWARE
// =============================
// Bắt buộc chạy SAU verifyToken
// verifyToken phải gán req.user = { id, email, role }

export const adminMiddleware = (req, res, next) => {
  try {
    // Chưa đăng nhập
    if (!req.user) {
      return res.status(401).json({
        message: "🚫 Unauthorized – chưa đăng nhập",
      });
    }

    // Không phải admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "🚫 Forbidden – cần quyền admin",
      });
    }

    // OK → cho đi tiếp
    next();
  } catch (error) {
    console.error("❌ Admin Middleware Error:", error);
    res.status(500).json({
      message: "Lỗi kiểm tra quyền admin",
    });
  }
};
