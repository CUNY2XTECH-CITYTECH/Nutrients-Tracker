// import dotenv from "dotenv";
// dotenv.config();

import axios from "axios";

export async function getRecipes(req, res) {
  try {
    const { query, health} = req.body;
    console.log("this is the query: ", query) ;
     console.log("this is the healthLabels: ", health) ;
    const response = await axios.get(  
      `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`, { 
        
        headers: {
        'Edamam-Account-User': `${process.env.APP_ID}`
        
    }}
    );
    res.json(response.data);
  } catch (error) {
    console.error('The error: ', error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
