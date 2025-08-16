import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.USDA_API_KEY;


// The object format that is going to be sent to the server
const foodTemplate = {
  foodId: '',
  name: '',
  nutrients: {
    1008: "No Data",
    1005: "No Data",
    1079: "No Data",
    2000:"No Data",
    1003:"No Data",

    1004:"No Data",
    1258:"No Data",
    1292:"No Data",
    1293:"No Data",
    1253:"No Data",

    1106: "No Data",
    1162: "No Data",
    1110: "No Data",
    1109: "No Data",
    1185: "No Data",
    1165: "No Data",
    1166: "No Data",
    1167: "No Data",
    1175: "No Data",
    1177: "No Data",

    1087: "No Data",
    1089: "No Data",
    1091: "No Data",
    1092: "No Data",
    1093: "No Data",
    1095: "No Data",
    1098: "No Data",
    1101: "No Data"
  }
};





//Function adds the data of the nutrients to the object
function filterFoodData(foodData) {

  const result = JSON.parse(JSON.stringify(foodTemplate)); //modify a copy of foodTemple convert into json and then js object to make deep copy
  
  result.foodId = foodData.fdcId;
  result.name = foodData.description;

  // Going throught all the nutrients and for api result and updates the values of each vitamin
  foodData.foodNutrients?.forEach(nutrient => {
    const nutrientId = nutrient.nutrient.id; 
    const nutrientValue = nutrient.amount;
    
    // If in our results.nutrients object we have the current nutruent, we update the repective value
    if (result.nutrients[nutrientId]) {
      result.nutrients[nutrientId] = nutrientValue;
    }
  });

  return result;
}

export async function FoodDetails(req, res) {
  const foodId = req.params.foodId || req.query.foodId;

  try {
    const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${foodId}`, {
      params: { 
        api_key: API_KEY,
        dataType: "Survey (FNDDS)" //Only gives results that have the object dataType:"Survey (FNDDS)". 
      }
      });
    
    const filteredData = filterFoodData(response.data);
    res.json(filteredData);
    
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch food details" });
  }
}