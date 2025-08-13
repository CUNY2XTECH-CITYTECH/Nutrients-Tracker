import mongoose from "mongoose";

const foodSavedSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  foodId: {
    type: Number,
    required: true
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
  date: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model("Food", foodSavedSchema);
