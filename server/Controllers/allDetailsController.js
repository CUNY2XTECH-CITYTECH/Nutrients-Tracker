import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.USDA_API_KEY;

// Helper function to format date
function transformFoodData(apiResponse) {
  // Map of nutrient IDs to their corresponding fields in your state structure
  const nutrientMap = {
    // Calories
    1008: { path: 'cal.value', unit: 'kcal' },
    
    // Macros
    1005: { path: 'macros.carbs.value', unit: 'g' },
    1079: { path: 'macros.fiber.value', unit: 'g' },
    2000: { path: 'macros.sugar.value', unit: 'g' },
    1003: { path: 'macros.protein.value', unit: 'g' },
    1004: { path: 'macros.fats.totalFat.value', unit: 'g' },
    1258: { path: 'macros.fats.saturatedFat.value', unit: 'g' },
    1292: { path: 'macros.fats.monounsaturatedFat.value', unit: 'g' },
    1293: { path: 'macros.fats.polyunsaturatedFat.value', unit: 'g' },
    1253: { path: 'macros.fats.cholesterol.value', unit: 'mg' },
    
    // Vitamins
    1106: { path: 'vitamins.vitaminA.value', unit: 'IU' },
    1162: { path: 'vitamins.vitaminC.value', unit: 'mg' },
    1110: { path: 'vitamins.vitaminD.value', unit: 'IU' },
    1109: { path: 'vitamins.vitaminE.value', unit: 'mg' },
    1185: { path: 'vitamins.vitaminK.value', unit: 'µg' },
    1165: { path: 'vitamins.thiamin.value', unit: 'mg' },
    1166: { path: 'vitamins.riboflavin.value', unit: 'mg' },
    1167: { path: 'vitamins.niacin.value', unit: 'mg' },
    1175: { path: 'vitamins.b6.value', unit: 'mg' },
    1177: { path: 'vitamins.folate.value', unit: 'µg' },
    
    // Minerals
    1087: { path: 'minerals.calcium.value', unit: 'mg' },
    1089: { path: 'minerals.iron.value', unit: 'mg' },
    1091: { path: 'minerals.phosphorus.value', unit: 'mg' },
    1092: { path: 'minerals.potassium.value', unit: 'mg' },
    1093: { path: 'minerals.sodium.value', unit: 'mg' },
    1095: { path: 'minerals.zinc.value', unit: 'mg' },
    1098: { path: 'minerals.copper.value', unit: 'mg' },
    1101: { path: 'minerals.manganese.value', unit: 'mg' }
  };

  // Initialize the result object with your desired structure
  const result = {
    foodId: apiResponse.fdcId.toString(),
    name: apiResponse.description || '',
    cal: { name: 'Calories', value: null, unit: 'kcal' },
    macros: {
      carbs: { name: 'Carbohydrates', value: null, unit: 'g' },
      fiber: { name: 'Dietary Fiber', value: null, unit: 'g' },
      sugar: { name: 'Sugars', value: null, unit: 'g' },
      protein: { name: 'Protein', value: null, unit: 'g' },
      fats: {
        totalFat: { name: 'Total Fat', value: null, unit: 'g' },
        saturatedFat: { name: 'Saturated Fat', value: null, unit: 'g' },
        monounsaturatedFat: { name: 'Monounsaturated Fat', value: null, unit: 'g' },
        polyunsaturatedFat: { name: 'Polyunsaturated Fat', value: null, unit: 'g' },
        cholesterol: { name: 'Cholesterol', value: null, unit: 'mg' }
      }
    },
    vitamins: {
      vitaminA: { name: 'Vitamin A', value: null, unit: 'IU' },
      vitaminC: { name: 'Vitamin C', value: null, unit: 'mg' },
      vitaminD: { name: 'Vitamin D', value: null, unit: 'IU' },
      vitaminE: { name: 'Vitamin E', value: null, unit: 'mg' },
      vitaminK: { name: 'Vitamin K', value: null, unit: 'µg' },
      thiamin: { name: 'Thiamin (B1)', value: null, unit: 'mg' },
      riboflavin: { name: 'Riboflavin (B2)', value: null, unit: 'mg' },
      niacin: { name: 'Niacin (B3)', value: null, unit: 'mg' },
      b6: { name: 'Vitamin B6', value: null, unit: 'mg' },
      folate: { name: 'Folate (B9)', value: null, unit: 'µg' }
    },
    minerals: {
      calcium: { name: 'Calcium', value: null, unit: 'mg' },
      iron: { name: 'Iron', value: null, unit: 'mg' },
      phosphorus: { name: 'Phosphorus', value: null, unit: 'mg' },
      potassium: { name: 'Potassium', value: null, unit: 'mg' },
      sodium: { name: 'Sodium', value: null, unit: 'mg' },
      zinc: { name: 'Zinc', value: null, unit: 'mg' },
      copper: { name: 'Copper', value: null, unit: 'mg' },
      manganese: { name: 'Manganese', value: null, unit: 'mg' }
    }
  };

  // Process each nutrient in the API response
  apiResponse.foodNutrients?.forEach(fn => {
    const nutrientId = fn.nutrient?.id;
    if (nutrientId && nutrientMap[nutrientId]) {
      const { path, unit } = nutrientMap[nutrientId];
      setNestedValue(result, path, fn.amount || null);
    }
  });

  return { result };
}

// Helper function to set nested values
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

export async function FoodDetails(req, res) {
  const foodId = req.params.foodId || req.query.foodId;
  
  if (!foodId) {
    return res.status(400).json({ error: "Food ID is required" });
  }

  const url = `https://api.nal.usda.gov/fdc/v1/food/${foodId}`;

  try {
    const response = await axios.get(url, {
      params: { api_key: API_KEY },
      timeout: 10000 // 10 second timeout
    });

    const transformedData = transformFoodData(response.data);
    return res.json(transformedData);
    
  } catch (error) {
    console.error("Error fetching food details:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      return res.status(error.response.status).json({
        error: "API request failed",
        status: error.response.status,
        message: error.response.data?.message || error.message
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(504).json({
        error: "No response from USDA API",
        message: "The request timed out or the server is unavailable"
      });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({
        error: "Internal server error",
        message: error.message
      });
    }
  }
}