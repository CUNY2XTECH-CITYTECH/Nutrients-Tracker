import mongoose from 'mongoose'

const foodLogSchema = new mongoose.Schema({
  username: String,   
  foodId: Number,
  mealType: String,
  serving: Number,
  unit: String,
  date: String,
});


export default mongoose.model("foodLog", foodLogSchema)
