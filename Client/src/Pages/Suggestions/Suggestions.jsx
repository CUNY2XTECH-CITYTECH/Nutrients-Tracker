import "../Suggestions/suggestions.css";
// import { Searchbar } from "../../Componets/Searchbar";
import { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import RecipeTile from "../../Componets/RecipeTile";

export function Suggestions() {
  const [query, setquery] = useState(""); // State to store the searched text typed by the user
  const [recipes, setrecipes] = useState([]); // State to store the list of recipes we get from the API
  const [healthLabels, sethealthLabels] = useState("vegan"); // State to store the selected health filter (default is "vegan")

  const APP_ID = "1f5fb058";
  const APP_KEY = "c5850537d4ae0ff30ca2928dccf6fb0b";

  const url = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&health=${healthLabels}`;

  // Function to fetch recipes from the API
  async function getRecipe() {
    var result = await axios.get(url);        // Wait for API data and store it in 'result'
    setrecipes(result.data.hits);         // Updates the recipes state with the API results
    console.log(result.data);     
  }


  // Function that runs when the search form is submitted
  const onSubmit = (e) => {     
    e.preventDefault();    // Prevent page from refreshing
    getRecipe();      // Call the function to get recipes
  };

  return (
    <div className="heading">
      <h1>Find Your Recipes🥘</h1>
      <form className="recipe_search" onSubmit={onSubmit}>
        <input
          type="text"
          className="ing_input"
          placeholder="Enter ingredient"
          value={query}
          onChange={(e) => setquery(e.target.value)}
        />
          
      {/* Dropdown for health/diet filters */}
         <select className="healthyLabels">
          <option onClick={() => sethealthLabels("vegan")}>Vegan</option>
          <option onClick={() => sethealthLabels("vegetarian")}>Vegetarian</option>
          <option onClick={() => sethealthLabels("dairy-free")}>Dairy-Free</option>
          <option onClick={() => sethealthLabels("low-sugar")}>low-sugar</option>
          <option onClick={() => sethealthLabels("egg-free")}>Egg-Free</option>
        </select>

        <button className="search-button" type="submit">
          <FaSearch />
        </button>
      </form>

      
   {/* Container for showing recipe results */}
      <div className="recipe_container">
        {recipes.map((recipe) => {
          return <RecipeTile recipe={recipe} />;
        })}
      </div>
    </div>
  );
}

// export function Suggestions() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedResult, setSelectedResult] = useState(null);
//   const [results, setResults] = useState([]);
//   const [searchedIngredients, setSearchedIngredients] = useState("");

//   const handleCardClick = (index) => {
//     setSelectedResult(results[index]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedResult(null);
//   };

//   const handleSearch = async (ingredients) => {
//     if (!ingredients.length || ingredients.every((i) => i.trim() === "")) {
//       setResults([]); // Clear results if all items are empty
//       return;
//     }

//     try {
//     //   setSearchedIngredients(ingredients.join(", "));
//     //   const data = await getMealSuggestions(ingredients);
//     //   setResults(data);
//     // } catch (err) {
//     //   console.error("API call failed:", err);
//     // }

//     const response = await axios.get("http://localhost:3000/suggestions/search",{
//                                   ingredients: ingredients
//                                   },
//                                   {
//                                   headers: { 'Content-Type': 'application/json' },
//                                   withCredentials: true
//     })
//     const data = response.data;
//     console.log(data)
//     setResults(response);
//     }catch (bananas) {
//       console.error(bananas)
//     }
//   };

//   return (
//     <div className="suggestions-container">
//       <h1>Find Meals For Your Ingredients</h1>

//       <Searchbar onSearch={handleSearch} />

//       <div className="results-container">
//         {results.map((result, index) => (
//           <Result_card
//             key={result.id || index}
//             title={result.title}
//             ingredients={searchedIngredients}
//             onClick={() => handleCardClick(index)}
//           />
//         ))}
//       </div>

//       {isModalOpen && selectedResult && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>{selectedResult.title}</h2>

//             <div>
//               <strong>Ingredients:</strong>

//               <ul>
//                 {(Array.isArray(selectedResult.ingredients)
//                   ? selectedResult.ingredients
//                   : [selectedResult.ingredients]
//                 ) // fallback if it's a single string
//                   .flatMap(
//                     (ingredient) =>
//                       ingredient
//                         ?.split("|") // Split string into separate options
//                         .map((item) => item.trim()) // Remove whitespace
//                   )
//                   .filter((item) => item !== "") // Remove empty strings
//                   .map((item, i) => (
//                     <li key={i}>{item}</li>
//                   ))}
//               </ul>
//             </div>

//             <div>
//               <strong>Instructions:</strong>
//               <ul>
//                 {selectedResult.instructions
//                   ?.split(".")
//                   .filter((s) => s.trim() !== "")
//                   .map((s, i) => (
//                     <li key={i}>{s.trim()}.</li>
//                   ))}
//               </ul>
//             </div>

//             <button className="xout" onClick={closeModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export function Suggestions() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedResult, setSelectedResult] = useState(null);
//   const [results, setResults] = useState([]);
//   const [searchedIngredients, setSearchedIngredients] = useState("");

//   const handleCardClick = (index) => {
//     setSelectedResult(results[index]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedResult(null);
//   };

//   // const handleSearch = async (ingredient) => {
//   //   if (!ingredient.length || ingredient.every((i) => i.trim() === "")) {
//   //     setResults([]); // Clear results if all items are empty
//   //     return;
//   //   } else {
//   //     ("no input");
//   //   }

//   //   try {
//   //     // Save the searched ingredients for display
//   //     setSearchedIngredients(ingredient);

//   //     // Make GET request to your Express server
//   //     const response = await axios.get(
//   //       "http://localhost:3000/suggestions/search",
//   //       {
//   //         ingredient: ingredient, // Pass as query string
//   //         withCredentials: true,
//   //       }
//   //     );

//   //     const data = response.data;
//   //     console.log("Recipe results:", data);

//   //     setResults(data); // Set the recipes to be displayed
//   //   } catch (error) {
//   //     console.error("API call failed:", error);
//   //   }
//   // };

// const handleSearch = async (ingredient) => {
//   const Input =
//     typeof ingredient === "string" ? ingredient.trim(): "";

//   if (!Input) {
//     setResults([]);
//     return;
//   }

//   try {
//     console.log("Sending ingredient:", Input);
//     setSearchedIngredients(Input);

//     const response = await axios.get("http://localhost:3000/suggestions/search", {
//       params: { ingredient: Input },
//       withCredentials: true,
//     });

//     // ✅ Use the whole response.data directly
//     const data = response.data;

//     console.log("Recipe results:", data);
//   } catch (error) {
//     console.error("API call failed:", error);
//     setResults([]);
//   }
// };

//   return (
//     <div className="suggestions-container">
//       <h1>Find Meals For Your Ingredients</h1>

//       <Searchbar onSearch={handleSearch} />

//       <div className="results-container">
//         {results.map((result, index) => (
//           <Result_card
//             key={result.id || index}
//             title={result.title}
//             ingredient={searchedIngredients}
//             onClick={() => handleCardClick(index)}
//           />
//         ))}
//       </div>

//       {isModalOpen && selectedResult && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h2>{selectedResult.title}</h2>

//             <div>
//               <strong>Ingredients:</strong>
//               <ul>
//                 {(Array.isArray(selectedResult.ingredients)
//                   ? selectedResult.ingredients
//                   : [selectedResult.ingredients]
//                 )
//                   .flatMap((ingredient) =>
//                     ingredient?.split("|").map((item) => item.trim())
//                   )
//                   .filter((item) => item !== "")
//                   .map((item, i) => (
//                     <li key={i}>{item}</li>
//                   ))}
//               </ul>
//             </div>

//             <div>
//               <strong>Instructions:</strong>
//               <ul>
//                 {selectedResult.instructions
//                   ?.split(".")
//                   .filter((s) => s.trim() !== "")
//                   .map((s, i) => (
//                     <li key={i}>{s.trim()}.</li>
//                   ))}
//               </ul>
//             </div>

//             <button className="xout" onClick={closeModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
