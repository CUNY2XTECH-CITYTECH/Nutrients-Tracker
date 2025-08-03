import express from 'express'
import axios  from 'axios';
const router = express.Router();

router.get('/test-env', (req, res) => {
    res.send(`Your USDA API key is: ${process.env.USDA_API_KEY}`);
});
// Add carbs, fats, proteins, foodID, mealType alongside name and calories

router.get('/usda-search', async (req, res) => {
    const query = req.query.query;
    const food = req.body;
    const rawMealType = req.query.mealType;
    const apikey = process.env.USDA_API_KEY;

    const allowedMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    const mealType = allowedMealTypes.includes(rawMealType) ? rawMealType: 'Not Specified';

    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food.foodName}&api_key=${apikey}`;

    try {
        const response = await axios.get(url);
        const results = response.data.foods.map(food => {
            const nutrients = food.foodNutrients;
            return {
                foodID: food.fdcId,
                name: food.description,
                calories: getNutrientValue(nutrients, 'Energy', 'KCAL'),
                carbs: getNutrientValue(nutrients, 'Carbohydrate, by difference', 'G'),
                fats: getNutrientValue(nutrients, 'Total lipid (fat)', 'G'),
                proteins: getNutrientValue(nutrients, 'Protein', 'G'),
                mealType: mealType
            };
        });
        
        res.json(results);
    }
    catch(error) {
        console.error('USDA API error:', error);
        res.status(500).send('Error fetching data from USDA');
    }
});

function getNutrientValue(nutrients, nutrientName, unitName) {
    const nutrient = nutrients.find(n => n.nutrientName === nutrientName && n.unitName === unitName);
    return nutrient ? nutrient.value : 'N/A';
}

export default router;