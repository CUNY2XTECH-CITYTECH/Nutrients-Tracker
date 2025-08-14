import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema({
  foodId: {
    type: Number,
    required: true
  },
  foodName: {
    type: String,
    require: true
  },
  username: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true
  },
  serving: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("FoodLog", foodLogSchema);
