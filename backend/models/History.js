import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // nếu chưa đăng nhập
    },
    ingredients: {
      type: [String],
      required: true, // ["chicken","lemon"]
    },
    prompt: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true, // Kết quả GPT trả về
    },
  },
  { timestamps: true } // tự động tạo createdAt, updatedAt
);

export default mongoose.model("History", historySchema);
