import "../Suggestions/suggestions.css";
// import { Searchbar } from "../../Componets/Searchbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import RecipeTile from "../../Componets/RecipeTile";

export function Suggestions() {
  const [query, setquery] = useState(""); // State to store the searched text typed by the user
  const [recipes, setrecipes] = useState([]); // State to store the list of recipes we get from the API
  const [healthLabels, sethealthLabels] = useState(""); // State to store the selected health filter (default is "vegan")
  const [dietFilters, setDietFilters] = useState("Diet Filters");

  async function getRecipe() {
    try {
      const response = await axios.post(`http://localhost:3000/recipes`, {
        query: query,
        healthLabels: healthLabels,
      });

      setrecipes(response.data.hits);
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
      getRecipe();
    }
  }, [query, healthLabels, dietFilters]);

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
          value={dietFilters}
          onChange={(e) => {
            setDietFilters(e.target.value);
            sethealthLabels(e.target.value);
          }}
        >
          <option value="">Diet Filters</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="kosher">Kosher</option>
          <option value="pork-free">Pork Free</option>
          <option value="alcohol-free">Alcohol Free</option>
          <option value="dairy-free">Dairy-Free</option>
          <option value="low-sugar">low-sugar</option>
        </select>

        <button className="search-button" type="submit">
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