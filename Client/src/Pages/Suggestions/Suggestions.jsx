import "../Suggestions/suggestions.css";
import { Searchbar } from "../../Componets/Searchbar";
import { Result_card } from "../../Componets/Result_card";
import { useState } from "react";
import { getMealSuggestions } from "../../API/recipes";

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
      console.error("API call failed:", err);
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

      {isModalOpen && selectedResult && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedResult.title}</h2>

            <div>
              <strong>Ingredients:</strong>
              {/* <ul>
                {selectedResult.ingredients
                  ?.split(",")
                  .map((ingredient, i) => (
                    <li key={i}>{ingredient.trim()}</li>
                  ))}
              </ul> */}
              <ul>
                {(Array.isArray(selectedResult.ingredients)
                  ? selectedResult.ingredients
                  : [selectedResult.ingredients]
                ) // fallback if it's a single string
                  .flatMap(
                    (ingredient) =>
                      ingredient
                        ?.split("|") // Split string into separate options
                        .map((item) => item.trim()) // Remove whitespace
                  )
                  .filter((item) => item !== "") // Remove empty strings
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>

            <div>
              <strong>Instructions:</strong>
              <ul>
                {selectedResult.instructions
                  ?.split(".")
                  .filter((s) => s.trim() !== "")
                  .map((s, i) => (
                    <li key={i}>{s.trim()}.</li>
                  ))}
              </ul>
            </div>

            <button className="xout" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
