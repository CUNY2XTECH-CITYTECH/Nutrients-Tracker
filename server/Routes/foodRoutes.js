import express from 'express'
import axios  from 'axios';
const router = express.Router();

router.get('/test-env', (req, res) => {
    res.send(`Your USDA API key is: ${process.env.USDA_API_KEY}`);
});

router.get('/usda-search', async (req, res) => {
    const query = req.query.query || 'orange';
    const apikey = process.env.USDA_API_KEY;

    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apikey}`;

    try{
        const response = await axios.get(url);
        const results = response.data.foods.map(food => ({
            name: food.description,
            calories: extraCalories(food.foodNutrients),
        }));
        
        res.json(results);
    }
    catch(error) {
        console.error('USDA API error:', error);
        res.status(500).send('Error fetching data from USDA');
    }
});

function extraCalories(nutrients) {
    const cal = nutrients.find(n => n.nutrientName === 'Energy' && n.unitName === 'KCAL');
    return cal ? cal.value: 'N/A';
}

export default router;