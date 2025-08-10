// Import necessary packages and models
import express, { Router } from 'express'
import axios  from 'axios';  // For making HTTP requests to USDA API
import Food from "../Models/food.js";  // Our database model for saved foods
const router = express.Router();  // Create a new router for food-related routes

// TEST ROUTE: Check if our environment variable (API key) is working
// This helps debug if there are API key issues
router.get('/test-env', (req, res) => {
    res.send(`Your USDA API key is: ${process.env.USDA_API_KEY}`);
});

// MAIN SEARCH ROUTE: This is where the frontend sends food searches
// Frontend sends: { foodValue: "chicken" }
// We return: [{ foodID, name, calories, carbs, fats, proteins, mealType }]
router.post('/usda-search', async (req, res) => {
    console.log("server food value: ", req.body)
    
    // Get data from the request
    const query = req.query.query;  // Not currently used, but available
    const { food } = req.body;  // Contains { foodValue: "whatever user searched" }
    const rawMealType = req.query.mealType;  // Optional meal type from URL params
    
    // VALIDATION: Make sure user actually typed something to search
    if (!food.foodValue || !food.foodValue.trim()) {
        return res.status(400).json({ error: 'Food query is required' });
    }
    
    // SETUP: Get search parameters and API key
    const limit = parseInt(req.body.limit) || parseInt(req.query.limit) || 10;  // How many results to return
    const apikey = process.env.USDA_API_KEY;  // Our secret API key from environment variables

    // MEAL TYPE VALIDATION: Only allow certain meal types, default to "Not Specified"
    const allowedMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    const mealType = allowedMealTypes.includes(rawMealType) ? rawMealType: 'Not Specified';

    // PREPARE API CALL: Build the URL for USDA API
    // encodeURIComponent() makes sure special characters don't break the URL
    const encodedQuery = encodeURIComponent(food.foodValue.trim());
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food.encodedQuery}&api_key=${apikey}`;

    try {
        // CALL USDA API: Get food data from database
        const response = await axios.get(url);
        
        // PROCESS RESULTS: Transform USDA's complex data into simple format for our frontend
        const results = response.data.foods.slice(0, limit).map(food => {
            const nutrients = food.foodNutrients;  // Get nutrient array from USDA data
            return {
                foodID: food.fdcId,  // Unique ID from USDA
                name: food.description,  // Food name (e.g., "Chicken breast, raw")
                calories: getNutrientValue(nutrients, 'Energy', 'KCAL'),  // Find calories
                carbs: getNutrientValue(nutrients, 'Carbohydrate, by difference', 'G'),  // Find carbs
                fats: getNutrientValue(nutrients, 'Total lipid (fat)', 'G'),  // Find fats
                proteins: getNutrientValue(nutrients, 'Protein', 'G'),  // Find proteins
                mealType: mealType  // Add the meal type we determined above
            };
        });
        
        // SEND RESULTS: Return the clean, simple data to frontend
        res.json(results);
    }
    catch(error) {
        // ERROR HANDLING: If USDA API fails, tell frontend something went wrong
        console.error('USDA API error:', error);
        res.status(500).send('Error fetching data from USDA');
    }
});

// GET ALL SAVED FOODS: Retrieve all foods that users have saved to our database
// This is different from searching USDA - this gets foods from OUR database
router.get("/all", async (req, res) => {
  try {
    const foods = await Food.find();  // Get all food records from MongoDB
    res.json(foods);  // Send them back as JSON
  } catch (error) {
    // If database query fails, send error message
    res.status(500).json({ message: "Error fetching foods", error: error.message });
  }
});

// SAVE FOOD TO DATABASE: When user wants to save a food to their personal list
// Frontend sends: { foodName: "Chicken Breast", mealType: "Dinner" }
router.post("/save", async (req, res) => {
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
        res.status(500).json({ message: "Error saving food", error: error.message });
    }
});

// HELPER FUNCTION: Find specific nutrient data from USDA's complex nutrient array
// USDA gives us a huge array of nutrients, this finds the one we want
// Example: getNutrientValue(nutrients, 'Energy', 'KCAL') finds calories
function getNutrientValue(nutrients, nutrientName, unitName) {
    // Search through the nutrient array to find matching name and unit
    const nutrient = nutrients.find(n => n.nutrientName === nutrientName && n.unitName === unitName);
    
    // If found, return the value; if not found, return 'N/A'
    return nutrient ? nutrient.value : 'N/A';
}

// Export this router so it can be used in our main server file
export default router;