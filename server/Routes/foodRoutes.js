import express from 'express';
import axios from 'axios';
import Food from "../Models/food.js";
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
router.post('/save', async (req, res) => {
    try {
        const { foodName, mealType } = req.body;
        
        const newFood = new Food({ 
            foodName, 
            mealType 
        });
        
        await newFood.save();
        res.status(201).json(newFood);
    } catch (error) {
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