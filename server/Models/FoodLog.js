const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  username: String,   // 这里是 username，不是 userId
  foodId: Number,
  mealType: String,
  serving: Number,
  unit: String,
  date: Date,
});

const FoodLogs = mongoose.model('foodlogs', foodLogSchema);

module.exports = FoodLogs;
