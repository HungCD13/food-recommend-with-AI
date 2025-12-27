import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      title: String,
      ingredients: [String],
      instructions: [String],
      image: String,
      time: String,
      calories: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
