import dotenv from "dotenv";
dotenv.config();
<<<<<<< HEAD
// import axios from "axios";

// const API_KEY = process.env.API_KEY

// export async function getMealSuggestions(req, res) {
//   const data = req.body;
//   const ingredient = data?.ingredient;
//     if(!ingredient) return res.json({"Error":"No ingredients"})
//     console.log('ingredients:, ', `https://api.api-ninjas.com/v1/recipe?query=${ingredient}`)

//   try {
//     const response = await axios.get(`https://api.api-ninjas.com/v1/recipe?query=${ingredient}`, {
        
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         "x-api-key": API_KEY,
//       }
//     })
//     res.json({"response": "not working"})
//     // Array of recipes

//   } catch (e) {
//     console.error(e);
//     res.json({ "Not Working": "fix me" });
//   }
// }
=======
>>>>>>> 4a47d62f6d69bd1c181a7132ec9e039340d77590

import axios from "axios";

export async function getRecipes(req, res) {
  try {
    const { query, healthLabels} = req.body;
    console.log("this is the query: ", query) ;
     console.log("this is the healthLabels: ", healthLabels) ;
     const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}${
                  healthLabels ? `&health=${healthLabels}` : "" }`;

    const response = await axios.get(url, { 
        
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
