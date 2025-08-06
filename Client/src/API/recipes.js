import axios from "axios";

// const API_KEY = "ec4d30a8335a4e93bff9adb34cacbbc6";

// export const getMealSuggestions = async (ingredients) => {
//   const res = await axios.get(
//     `https://api.spoonacular.com/recipes/findByIngredients`,
//     {
//       params: {
//         ingredients: ingredients.join(","),
//         number: 3,
//         ignorePantry: true,
//         apiKey: API_KEY,
//       },
//     }
//   );
//   return res.data;
// };


const API_KEY = "zP/BJR1rRQWI7tn4ORLMcA==HUZd1BnpEQzcoBGg";

export const getMealSuggestions = async (ingredients) => {
  const query = ingredients.join(",");
  const response = await axios.get("https://api.api-ninjas.com/v1/recipe", {
    headers: {
      "X-Api-Key": API_KEY,
    },
    params: {
      query,
    },
  });

  return response.data; // Array of recipes
};