import express from 'express';
import axios from 'axios';
import Food from "../Models/FoodLog.js"; // This now refers to the updated Food model
import {verifyJWT} from "../Middleware/verifyJWT.js"
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
router.post('/save',verifyJWT, async (req, res) => {
    const username = req.userInfo.username
    try {
        console.log("Received: ", req.body);
        
        const { foodID, name, date, mealType, serving, unit, calories } = req.body;
        
        const requiredFields = ['foodID', 'name', 'mealType', 'serving', 'unit', 'calories'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                missing: missingFields,
                received: Object.keys(req.body)
            });
        }

        const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
        const normalizedMealType = mealType.toLowerCase();

        if (!validMealTypes.includes(normalizedMealType)) {
            return res.status(400).json({
                message: "Invalid meal type",
                validOptions: validMealTypes,
                received: mealType
            });
        }

        const newFood = new Food({
            foodId: Number(foodID),
            name: name.trim(),
            username: username,
            Date: date ? new Date(date) : new Date(),
            mealType: normalizedMealType,
            serving: Number(serving),
            unit: unit,
            calories: Number(calories) || 0,
            createdAt: new Date() 
        });

        await newFood.save();

        res.status(201).json({
            success: true,
            savedEntry: {
                foodID: newFood.foodId,
                name: newFood.name,
                username: newFood.username,
                Date: newFood.Date,
                mealType: newFood.mealType,
                serving: newFood.serving,
                unit: newFood.unit,
                calories: newFood.calories,
                createdAt: newFood.createdAt
            }
        });
    }
    catch(error) {
        console.error("Save error: ", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Duplicate entry',
                details: 'This log entry already exists'
            });
        }
        res.status(500).json({
            error: 'Server error',
            details: process.env.NODE_ENV === 'development'
                ? error.message
                : 'Internal server error'
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