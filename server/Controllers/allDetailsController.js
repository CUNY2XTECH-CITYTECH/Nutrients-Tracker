import axios from "axios";
import Redis from "redis";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.USDA_API_KEY;
const redisClient = Redis.createClient('redis://localhost:6379'); //pass production instance url for redis when going into production

// IIFE (anonymous async function that run whenever the file runs) Connect to Redis when the app starts
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
})();


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
async function filterFoodData(foodData) {

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
  await redisClient.json.set(`foodId:${result.foodId}`, "$", result); //Saves food details to redis cache
  return result;
}


//Makes a API resquest to USDA api to get food data and then saves it to redis cache
async function usdaApiRequest(foodId) {
  try {
    const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${foodId}`, {
      params: { 
        api_key: API_KEY,
        dataType: "Survey (FNDDS)" //Only gives results that have the object dataType:"Survey (FNDDS)". 
      }
      });

    return response.data
    
  } catch(error) {
    console.error(error);
    throw error
  }
}


//Gets the food details saved in cache by foodID. If its not there, return null
async function redisCacheRequest (foodId) {

  try {
    const getCache = await redisClient.json.get(`foodId:${foodId}`)
    console.log(getCache)
    return getCache

  }catch(error){
    console.error(error)
    return null
  }
}


//This is the funciton that is getting exported and receives the req and res arguements from routes
export async function FoodDetails(req, res) {
  const foodId = req.params.foodId || req.query.foodId;  //Gets the foodId that is send by client

  const detailsFromCache = await redisCacheRequest(foodId)  //Runs function that gets foodDetails from cache

  //If not in cache, makes api call to USDA API to get it and then fillers data to what we need to send to client
  if (!detailsFromCache) {
    const detailsFromApi = await usdaApiRequest(foodId)
    const formatFoodInfo = await filterFoodData(detailsFromApi)
    res.json(formatFoodInfo)    
  }

  //If in cache, return it to client
  res.json(detailsFromCache)
}
