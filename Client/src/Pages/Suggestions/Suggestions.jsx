import "../Suggestions/suggestions.css";
// import { Searchbar } from "../../Componets/Searchbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import RecipeTile from "../../Componets/RecipeTile";

export function Suggestions() {
  const [query, setquery] = useState(""); // State to store the searched text typed by the user
  const [recipes, setrecipes] = useState([]); // State to store the list of recipes we get from the API
  const [healthLabels, sethealthLabels] = useState("vegan"); // State to store the selected health filter (default is "vegan")

  async function getRecipe() {
    console.log("its working");
    try {
      const response = await axios.post(`http://localhost:3000/recipes`,
        {query:query,
          health:healthLabels
        }
      );

      console.log(response.data.hits);
      setrecipes(response.data.hits)
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  }

  // Function that runs when the search form is submitted
  const onSubmit = (e) => {
    e.preventDefault(); // Prevent page from refreshing
    getRecipe(); // Call the function to get recipes
  };

  useEffect(() => {
    if (query.trim() !== "") {
      console.log("useEffect triggered. Fetching recipes...");
      getRecipe();
    }
  }, [query, healthLabels]);

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
        <select
          className="healthyLabels"
          value={healthLabels}
          onChange={(e) => sethealthLabels(e.target.value)}
        >
          <option onClick={() => sethealthLabels("vegan")}>Vegan</option>
          <option onClick={() => sethealthLabels("vegetarian")}>Vegetarian</option>
          <option onClick={() => sethealthLabels("dairy-free")}>Dairy-Free</option>
          <option onClick={() => sethealthLabels("low-sugar")}>low-sugar</option>
          <option onClick={() => sethealthLabels("egg-free")}>Egg-Free</option>
        </select>

        <button
          className="search-button"
          type="submit"
        >
          <FaSearch />
        </button>
      </form>

      {/* Container for showing recipe results */}
      <div className="recipe_container">
        {recipes.map((recipe, index) => {
          return <RecipeTile key={index} recipe={recipe} />;
        })}
      </div>
    </div>
  );
}