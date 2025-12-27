// models/History.js
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Thêm index để tìm kiếm nhanh hơn
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: {
    type: [String],
    default: []
  },
  instructions: {
    type: [String],
    default: []
  },
  time: {
    type: String,
    default: 0
  },
  calories: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  rawIngredients: {
    type: [String],
    default: ''
  },
  rawPrompt: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Tạo compound index để tối ưu query
historySchema.index({ userId: 1, createdAt: -1 });

const History = mongoose.model('History', historySchema);

export default History;