import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// =============================
// 🔐 VERIFY JWT TOKEN
// =============================
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "🚫 Không có token, truy cập bị từ chối",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn user info vào request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("❌ JWT Verify Error:", error);
    return res.status(401).json({
      message: "🚫 Token không hợp lệ hoặc đã hết hạn",
    });
  }
};
