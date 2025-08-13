import express from 'express';
import axios from 'axios';
import Food from "../Models/food.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// USDA API Search Endpoint
router.post('/search', async (req, res) => {
    try {
        const { food } = req.body;
        const apiKey = process.env.USDA_API_KEY;

        if (!food || typeof food !== 'string') {
            return res.status(400).json({ error: 'Invalid food search term' });
        }

        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/foods/search`,
            {
                params: {
                    api_key: apiKey,
                    query: food,
                    pageSize: 10
                }
            }
        );

        // Process response to ensure consistent structure
        const formattedFoods = response.data.foods.map(item => ({
            fdcId: item.fdcId,
            description: item.description || "Unknown Food",
            foodNutrients: (item.foodNutrients || [])
                .filter(n => n.nutrientName && n.value && n.unitName)
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

// Get detailed food information 
router.get('/details', async (req, res) => {
    try {
        const { fdcId } = req.query;
        const apiKey = process.env.USDA_API_KEY;

        if (!fdcId) {
            return res.status(400).json({ error: 'Missing fdcId parameter' });
        }

        const response = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
            {
                params: {
                    api_key: apiKey
                }
            }
        );

        // Enhanced nutrient filtering to include more comprehensive nutrition data
        const importantNutrients = [
            'Protein',
            'Carbohydrate, by difference',
            'Total lipid (fat)',
            'Energy',
            'Sugars, total',
            'Fiber, total dietary',
            'Calcium, Ca',
            'Iron, Fe',
            'Potassium, K',
            'Sodium, Na',
            'Vitamin C, total ascorbic acid',
            'Cholesterol',
            'Vitamin A, RAE',
            'Vitamin D (D2 + D3)'
        ];

        // Process nutrients from the response
        let nutrients = [];
        
        if (response.data.foodNutrients && Array.isArray(response.data.foodNutrients)) {
            nutrients = response.data.foodNutrients
                .filter(n => {
                    // Handle different response structures from USDA API
                    const nutrientName = n.nutrientName || (n.nutrient && n.nutrient.name);
                    const value = n.value || n.amount;
                    const unitName = n.unitName || (n.nutrient && n.nutrient.unitName);
                    
                    return nutrientName && 
                           (value || value === 0) && 
                           unitName &&
                           importantNutrients.includes(nutrientName);
                })
                .map(nutrient => {
                    // Normalize the structure
                    const nutrientName = nutrient.nutrientName || nutrient.nutrient.name;
                    const value = nutrient.value || nutrient.amount;
                    const unitName = nutrient.unitName || nutrient.nutrient.unitName;
                    
                    return {
                        nutrientName: nutrientName,
                        value: value,
                        unitName: unitName
                    };
                });
        }

        const detailedFood = {
            food_id: response.data.fdcId,
            food_name: response.data.description || "Unknown Food",
            nutrients: nutrients
        };

        res.json(detailedFood);
    } catch (error) {
        console.error('USDA API Details Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch food details',
            details: error.message 
        });
    }
});

// Save food to database
router.post('/save', async (req, res) => {
    try {
        const { foodName, mealType, foodID, serving, units, calories, carbs, fats, proteins } = req.body;

        if(!foodName || !mealType || !foodID || !serving || !units) {
            return res.status(400).json({
                message: "Missing required fields", 
                require: ["foodName", "mealType", "foodId", "serving", "units"]
            });
        }
        
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
        
        await newFood.save();

        res.json({ 
            message: "Food saved successfully",
            food: newFood
        });
    } catch (error) {
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

export default router;