import express from 'express'
import axios  from 'axios';
import Food from "../Models/food.js";


import { verifyJWT } from '../Middleware/verifyJWT.js';
import { userDetails } from '../Controllers/userDetails.js';
import { FoodDetails}  from '../Controllers/allDetailsController.js';
import { deleteLog } from '../Controllers/deleteLogController.js';

const router = express.Router();

// router.get('/test-env', (req, res) => {
//     res.send(`Your USDA API key is: ${process.env.USDA_API_KEY}`);
// });

// router.post('/usda-search', async (req, res) => {
//     console.log("server food value: ", req.body)
//     const query = req.query.query;
//     const food = req.body;
//     const rawMealType = req.query.mealType;
//     const limit = parseInt(req.query.limit) || 10;
//     const apikey = process.env.USDA_API_KEY;

//     const allowedMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
//     const mealType = allowedMealTypes.includes(rawMealType) ? rawMealType: 'Not Specified';

//     const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food.foodValue}&api_key=${apikey}`;

//     try {
//         const response = await axios.get(url);
//         const results = response.data.foods.slice(0, limit).map(food => {
//             const nutrients = food.foodNutrients;
//             return {
//                 foodID: food.fdcId,
//                 name: food.description,
//                 calories: getNutrientValue(nutrients, 'Energy', 'KCAL'),
//                 carbs: getNutrientValue(nutrients, 'Carbohydrate, by difference', 'G'),
//                 fats: getNutrientValue(nutrients, 'Total lipid (fat)', 'G'),
//                 proteins: getNutrientValue(nutrients, 'Protein', 'G'),
//                 mealType: mealType
//             };
//         });
        
//         res.json(results);
//     }
//     catch(error) {
//         console.error('USDA API error:', error);
//         res.status(500).send('Error fetching data from USDA');
//     }
// });

// router.get("/all", async (req, res) => {
//   try {
//     const foods = await Food.find();
//     res.json(foods);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching foods", error: error.message });
//   }
// });

// router.post("/save", async (req, res) => {
//     try {
//         const { name, mealType } = req.body;
//         console.log("Received: ", name, mealType);
//         const newFood = new Food({ name, mealType });
//         await newFood.save();

//         res.json({ food: name, meal: mealType });
//     } catch (error) {
//         res.status(500).json({ message: "Error saving food", error: error.message });
//     }
// });

// function getNutrientValue(nutrients, nutrientName, unitName) {
//     const nutrient = nutrients.find(n => n.nutrientName === nutrientName && n.unitName === unitName);
//     return nutrient ? nutrient.value : 'N/A';
// }

router.get("/user-details", verifyJWT, userDetails)
router.get("/food-all-details", verifyJWT, FoodDetails)
router.delete("/deleteLog", verifyJWT, deleteLog)

export default router;