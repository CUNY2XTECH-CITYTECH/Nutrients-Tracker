import mongoose from "mongoose";

const foodSavedSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  mealType: { 
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Not Specified'],
    required: true
  },
  foodID: { type: Number, required: true },
  serving: { type: Number, required: true },
  units: { type: String, required: true },

  // Macronutrients
  calories: Number,
  carbs: Number,
  fats: Number,
  proteins: Number,
  fiber: Number,
  sugar: Number,

  // Vitamins
  vit_a: Number,
  b1: Number,
  b2: Number,
  b3: Number,
  b5: Number,
  b6: Number,
  b7: Number,
  b9: Number,
  b12: Number,
  vit_c: Number,
  vit_d: Number,
  vit_e: Number,
  vit_k: Number,

  // Minerals
  calcium: Number,
  copper: Number,
  iodine: Number,
  iron: Number,
  manganese: Number,
  phosphorus: Number,
  potassium: Number,
  selenium: Number,
  sodium: Number,
  zinc: Number,

  date: { type: Date, default: Date.now }
});

export default mongoose.model("Food", foodSavedSchema);
