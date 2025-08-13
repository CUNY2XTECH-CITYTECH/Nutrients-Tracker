import express from 'express';
import axios from 'axios';
import Food from "../Models/food.js"; // This now refers to the updated Food model
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// Nutrient mapping for consistent naming
const nutrientMap = {
  "Energy": "Calories",
  "Protein": "Protein",
  "Carbohydrate, by difference": "Carbs",
  "Total lipid (fat)": "Fats",
  "Fiber, total dietary": "Fiber",
  "Sugars, total including NLEA": "Sugar",
  "Vitamin A, RAE": "Vitamin A",
  "Thiamin": "Vitamin B1",
  "Riboflavin": "Vitamin B2",
  "Niacin": "Vitamin B3",
  "Pantothenic acid": "Vitamin B5",
  "Vitamin B-6": "Vitamin B6",
  "Biotin": "Vitamin B7",
  "Folate, total": "Vitamin B9",
  "Vitamin B-12": "Vitamin B12",
  "Vitamin C, total ascorbic acid": "Vitamin C",
  "Vitamin D (D2 + D3)": "Vitamin D",
  "Vitamin E (alpha-tocopherol)": "Vitamin E",
  "Vitamin K (phylloquinone)": "Vitamin K",
  "Calcium, Ca": "Calcium",
  "Copper, Cu": "Copper",
  "Iodine, I": "Iodine",
  "Iron, Fe": "Iron",
  "Manganese, Mn": "Manganese",
  "Phosphorus, P": "Phosphorus",
  "Potassium, K": "Potassium",
  "Selenium, Se": "Selenium",
  "Sodium, Na": "Sodium",
  "Zinc, Zn": "Zinc",
};

// USDA API Search Endpoint
router.post('/search', async (req, res) => {
    try {
        const { food } = req.body; // Get search term from request body
        const apiKey = process.env.USDA_API_KEY;

        if (!food || typeof food !== 'string') {
            return res.status(400).json({ error: 'Invalid food search term' });
        }

        // Make request to USDA API
        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/foods/search`,
            {
                params: {
                    api_key: apiKey,
                    query: food,
                    pageSize: 10 // Limit results
                }
            }
        );

        // Process and format the response data
        const formattedFoods = response.data.foods.map(item => ({
            fdcId: item.fdcId,
            description: item.description,
            foodNutrients: item.foodNutrients
                .filter(n => Object.keys(nutrientMap).includes(n.nutrientName))
                .map(nutrient => ({
                    nutrientName: nutrient.nutrientName,
                    value: nutrient.value,
                    unitName: nutrient.unitName
                }))
        }));

        res.json(formattedFoods);
    } catch (error) {
        console.error('USDA API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch food data',
            details: error.message 
        });
    }
});

// NEW: Get detailed food information by FDC ID (for popup)
router.get('/details', async (req, res) => {
    try {
        const { fdcId } = req.query;
        const apiKey = process.env.USDA_API_KEY;

        if (!fdcId) {
            return res.status(400).json({ error: 'FDC ID is required' });
        }

        // Make request to USDA API for specific food details
        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
            {
                params: {
                    api_key: apiKey
                }
            }
        );

        const foodData = response.data;
        
        // Format the detailed response for frontend
        const formattedFood = {
            food_id: foodData.fdcId,
            food_name: foodData.description,
            nutrients: foodData.foodNutrients
                .filter(n => Object.keys(nutrientMap).includes(n.nutrient.name))
                .map(nutrient => ({
                    nutrientName: nutrient.nutrient.name,
                    value: nutrient.amount || 0,
                    unitName: nutrient.nutrient.unitName
                }))
        };

        res.json(formattedFood);
    } catch (error) {
        console.error('USDA API Details Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch food details',
            details: error.message 
        });
    }
});

// Save food to database (Updated for new Food model structure)
router.post('/save', async (req, res) => {
    try {
        console.log("Received: ", req.body);
        
        // Get the required fields from request body
        const { foodName, mealType, foodID, serving, units, username } = req.body;
        
        if(!foodID || !mealType || !serving || !units) {
            return res.status(400).json({
                message: "Missing required fields", 
                require: ["foodID", "mealType", "serving", "units"]
            });
        }

        // Validate and normalize mealType to match enum
        const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
        const normalizedMealType = mealType.toLowerCase();
        
        if (!validMealTypes.includes(normalizedMealType)) {
            return res.status(400).json({
                message: "Invalid mealType. Must be one of: breakfast, lunch, dinner, snack"
            });
        }
        
        // Create a new food record using the updated Food model
        const newFood = new Food({ 
            username: username || "defaultUser", // You can modify this to get from auth
            foodId: Number(foodID),
            mealType: normalizedMealType,
            serving: Number(serving),
            unit: units
        });

        await newFood.save();

        // Confirm to frontend that it was saved
        res.json({ 
            message: "Food saved successfully",
            food: newFood
        });
    } catch (error) {
        // If saving fails, tell frontend what went wrong
        console.error("Save error: ", error);
        res.status(500).json({ 
            error: 'Failed to save food',
            details: error.message 
        });
    }
});

// Get all saved foods
router.get('/all', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch foods',
            details: error.message 
        });
    }
});

// Export this router so it can be used in our main server file
export default router;