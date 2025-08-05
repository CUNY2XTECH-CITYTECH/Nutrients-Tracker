import mongoose from "mongoose";

const foodSavedSchema = new mongoose.Schema({
  foodID: {
    type: Number,
    required: true,
  },
  serving: {
    type: Number,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  mealType: {
    type: String,
    times: ['Breakfast', 'Lunch', 'Dinner', 'Not Specified'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Food", foodSavedSchema);
