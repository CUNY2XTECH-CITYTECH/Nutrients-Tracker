import "../Suggestions/suggestions.css";
import { Searchbar } from "../../Componets/Searchbar";
import { Result_card } from "../../Componets/Result_card";
import { useState } from "react";
import { getMealSuggestions } from "../../API/recipes";

export function Suggestions() {
<<<<<<< HEAD
  const [query, setquery] = useState(""); // State to store the searched text typed by the user
  const [recipes, setrecipes] = useState([]); // State to store the list of recipes we get from the API
  const [healthLabels, sethealthLabels] = useState(""); // State to store the selected health filter (default is "vegan")
  const [dietFilters, setDietFilters] = useState("Diet Filters")

  async function getRecipe() {
    try {
      const response = await axios.post(`http://localhost:3000/recipes`,
        {query:query,
          healthLabels:healthLabels
        }
      );

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
      getRecipe();
    }
  }, [query, healthLabels, dietFilters]);
=======
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [results, setResults] = useState([]);
  const [searchedIngredients, setSearchedIngredients] = useState("");

  const handleCardClick = (index) => {
    setSelectedResult(results[index]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  const handleSearch = async (ingredients) => {
    if (!ingredients.length || ingredients.every((i) => i.trim() === "")) {
      setResults([]); // Clear results if all items are empty
      return;
    }

    try {
      setSearchedIngredients(ingredients.join(", "));
      const data = await getMealSuggestions(ingredients);
      setResults(data);
    } catch (err) {
      console.error("API call failed:", err);
    }
  };
>>>>>>> 51e5d5145050ea51f20939b8e1878443896861d0

  return (
    <div className="suggestions-container">
      <h1>Find Meals For Your Ingredients</h1>

<<<<<<< HEAD
        {/* Dropdown for health/diet filters */}
        <select
          className="healthyLabels"
          value={dietFilters}
          onChange={(e) => {setDietFilters(e.target.value)
                            sethealthLabels(e.target.value)}
                          }
        >
          <option value="" >Diet Filters</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="kosher">Kosher</option> 
          <option value="pork-free">Pork Free</option>
          <option value="alcohol-free">Alcohol Free</option>
          <option value="dairy-free">Dairy-Free</option>
          <option value="low-sugar">low-sugar</option>
        </select>
=======
      <Searchbar onSearch={handleSearch} />
>>>>>>> 51e5d5145050ea51f20939b8e1878443896861d0

      <div className="results-container">
        {results.map((result, index) => (
          <Result_card
            key={result.id || index}
            title={result.title}
            ingredients={searchedIngredients}
            onClick={() => handleCardClick(index)}
          />
        ))}
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
