import mongoose from "mongoose";

const foodSavedSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  foodID: {
    type: Number,
    required: true,
  },
  serving: {
    type: Number,
    required: true,
  },
  units: {
    type: String, 
    required: true,
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Not Specified'],
    required: true,
  },
  calories: {
    type: Number,
    required: false,
  },
  carbs: {
    type: Number,
    required: false,
  },
  fats: {
    type: Number,
    required: false,
  },
  proteins: {
    type: Number,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Food", foodSavedSchema);
