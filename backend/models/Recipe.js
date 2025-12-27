import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    // =============================
    // BASIC INFO
    // =============================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // URL ảnh (AI gen hoặc Unsplash)
      default: "",
    },

    time: {
      type: String, // ví dụ: "15 mins"
      default: "15 mins",
    },

    calories: {
      type: String, // ví dụ: "300 kcal"
      default: "300 kcal",
    },

    // =============================
    // CONTENT
    // =============================
    ingredients: {
      type: [String],
      required: true,
    },

    instructions: {
      type: [String],
      required: true,
    },

    // =============================
    // AI & SYSTEM
    // =============================
    generatedByAI: {
      type: Boolean,
      default: true,
    },

    promptUsed: {
      type: String, // prompt gửi cho GPT (dùng cho admin / audit)
      default: "",
    },

    // =============================
    // RELATION
    // =============================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: false, // admin có thể duyệt public
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Recipe", recipeSchema);
