import express from 'express';
import axios from 'axios';
import Food from "../Models/food.js";
import { verifyJWT } from '../Middleware/verifyJWT.js';
const router = express.Router();

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
                .filter(n => ['Protein', 'Carbohydrate, by difference', 'Total lipid (fat)', 'Energy'].includes(n.nutrientName))
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

// Save food to database
// SAVE FOOD TO DATABASE: When user wants to save a food to their personal list
// Frontend sends: { foodName: "Chicken Breast", mealType: "Dinner" }
router.post('/save', async (req, res) => {
    try {
        // Get the food name and meal type from request body
        const { foodName, mealType, foodID, serving, units, calories, carbs, fats, proteins } = req.body;
        console.log("Received: ", req.body);

        if(!foodName || !mealType || !foodID || !serving || !units) {
            return res.status(400).json({
                message: "Missing required fields", 
                require: ["foodName", "mealType", "foodId", "serving", "units"]
            });
        }
        
        // Create a new food record using our MongoDB model
        const newFood = new Food({ 
            foodName, 
            mealType, 
            foodID: Number(foodID), 
            serving: Number(serving), 
            units,
            calories: calories || 0,
            carbs: carbs || 0,
            fats: fats || 0,
            proteins: proteins || 0
        });
        
        // Save it to the database
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
