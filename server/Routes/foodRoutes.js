import express from 'express';
import axios from 'axios';
import Food from "../Models/food.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

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

// Save food to database
// SAVE FOOD TO DATABASE: When user wants to save a food to their personal list
// Frontend sends: { foodName: "Chicken Breast", mealType: "Dinner" }
router.post('/save', async (req, res) => {
    try {
        console.log("Received: ", req.body);
        // Get the food name and meal type from request body
        const { foodName, mealType, foodID, serving, units,
            calories, carbs, fats, proteins, fiber, sugar,
            vit_a, b1, b2, b3, b5, b6, b7, b9, b12,
            vit_c, vit_d, vit_e, vit_k,
            calcium, copper, iodine, iron, manganese, phosphorus,
            potassium, selenium, sodium, zinc 
        } = req.body;
        console.log("Received: ", req.body);

        if(!foodName || !mealType || !foodID || !serving || !units) {
            return res.status(400).json({
                message: "Missing required fields", 
                require: ["foodName", "mealType", "foodID", "serving", "units"]
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
            proteins: proteins || 0,
            fiber: fiber || 0,
            sugar: sugar || 0,
            vit_a: vit_a || 0,
            b1: b1 || 0,
            b2: b2 || 0,
            b3: b3 || 0,
            b5: b5 || 0,
            b6: b6 || 0,
            b7: b7 || 0,
            b9: b9 || 0,
            b12: b12 || 0,
            vit_c: vit_c || 0,
            vit_d: vit_d || 0,
            vit_e: vit_e || 0,
            vit_k: vit_k || 0,
            calcium: calcium || 0,
            copper: copper || 0,
            iodine: iodine || 0,
            iron: iron || 0,
            manganese: manganese || 0,
            phosphorus: phosphorus || 0,
            potassium: potassium || 0,
            selenium: selenium || 0,
            sodium: sodium || 0,
            zinc: zinc || 0
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