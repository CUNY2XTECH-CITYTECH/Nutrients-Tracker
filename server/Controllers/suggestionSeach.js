import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const API_KEY = process.env.API_KEY

export async function getMealSuggestions(req, res) {
  const data = req.body;
  const ingredient = data?.ingredient;
    if(!ingredient) return res.json({"Error":"No ingredients"})
    console.log('ingredients:, ', `https://api.api-ninjas.com/v1/recipe?query=${ingredient}`)

  try {
    const response = await axios.get(`https://api.api-ninjas.com/v1/recipe?query=${ingredient}`, {
        
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "x-api-key": API_KEY,
      }
    })
    res.json({"response": "not working"})
    // Array of recipes

  } catch (e) {
    console.error(e);
    res.json({ "Not Working": "fix me" });
  }
}
